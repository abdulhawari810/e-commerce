import UsersModel from "../models/UsersModel.js";
import argon2 from "argon2";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import nodemailer from "nodemailer";
import { io, userSocket } from "../main.js";

dotenv.config();

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_SMTP_USER,
    pass: process.env.APP_SMTP_PASS,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

export const Login = async (req, res) => {
  try {
    const { userOrEmail, password } = req.body;
    const users = await UsersModel.findOne({
      where: {
        [Op.or]: [{ username: userOrEmail }, { email: userOrEmail }],
      },
    });

    if (!users)
      return res.status(404).json({
        error: true,
        code: 404,
        tipe: "userOrEmail",
        message: "Email Address Or Username Not Found",
      });

    const match = await argon2.verify(users.password, password);

    if (!match)
      return res.status(404).json({
        error: true,
        code: 404,
        tipe: "password",
        message: "Password Wrong",
      });

    const token = jwt.sign(
      {
        id: users.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: "auto",
      sameSite: "none",
      maxAge: 168 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successfully",
      token,
      users: {
        id: users.id,
        username: users.username,
        email: users.email,
        profile: users.profile,
        role: users.role,
        status: users.status,
        is_verified: users.is_verified,
        phone: users.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const Register = async (req, res) => {
  try {
    const { username, email, password, confPassword, otp } = req.body;

    const existingUsers = await UsersModel.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    const role = existingUsers ? "admin" : "users";

    if (existingUsers) {
      return res.status(404).json({
        error: true,
        code: 404,
        message: "username or email has been used",
      });
    }

    if (password !== confPassword) {
      return res.status(403).json({
        error: true,
        code: 404,
        message: "Password not matches",
      });
    }

    const hash = await argon2.hash(password);

    const data = otpStore[email];

    if (!data) {
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Code Not Found" });
    }

    if (Date.now() > data.expire) {
      return res
        .status(400)
        .json({ error: true, code: 400, message: "Code has been expired" });
    }

    if (parseInt(otp) !== data.code) {
      return res.status(400).json({
        error: true,
        code: 400,
        message: "Code is wrong",
      });
    }

    delete otpStore[email];

    await UsersModel.create({
      username,
      email,
      password: hash,
      role,
      is_active: true,
      is_verified: true,
    });

    res
      .status(200)
      .json({ success: true, code: 200, message: "Register Berhasil" });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUsers = await UsersModel.findOne({
      where: {
        email,
      },
    });

    if (existingUsers)
      return res
        .status(429)
        .json({ error: true, message: "Email ini sudah terdaftar" });

    const existingOTP = otpStore[email];

    if (existingOTP && Date.now() < existingOTP.expire) {
      return res.status(429).json({
        error: true,
        message: "OTP masih aktif, silakan tunggu",
      });
    }

    const otp = generateOTP();

    otpStore[email] = {
      code: otp,
      expire: Date.now() + 25 * 60 * 1000,
      attempts: 0,
    };

    await transporter.sendMail({
      from: "Morphy admin@morphy.my.id",
      to: email,
      subject: "Code Verification",
      html: `
        <h2>Kode Verifikasi</h2>
        <b style="font-size:20px;">${otp}</b>
        <p>Berlaku 25 menit.</p>
      `,
    });

    res.json({ success: true, message: "Kode OTP dikirim" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const Me = async (req, res) => {
  try {
    const users = req.user;
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const Logout = async (req, res) => {
  try {
    io.on("connection", (socket) => {
      socket.on("user:logout", () => {
        const userId = req.user.id;
        if (userId) {
          delete userSocket[userId];
        }
      });

      socket.on("disconnect", () => {
        const userId = req.user.id;

        if (userId) {
          delete userSocket[userId];
        }
      });
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: "auto",
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logout Berhasil" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
