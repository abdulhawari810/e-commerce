import { Op } from "sequelize";
import UsersModels from "./../model/UsersModels.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { username, email, password, confPassword } = req.body;

    const users = await UsersModels.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
    const allUsers = await UsersModels.findAll();
    const role = allUsers.length > 0 ? "users" : "admin";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password harus terdiri dari 8 karakter, huruf besar, huruf kecil, dan angka!",
      });
    }

    if (
      (users && users.username === username) ||
      (users && users.email === email)
    )
      return res
        .status(403)
        .json({ message: "Username atau Email sudah digunakan!" });

    if (password !== confPassword)
      return res
        .status(403)
        .json({ message: "Password dan Konfirmasi Password tidak sama!!" });

    const hashPassword = await argon2.hash(password);
    await UsersModels.create({
      username,
      email,
      password: hashPassword,
      role,
    });
    res.status(201).json({ message: "Registrasi Berhasil!!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const Login = async (req, res) => {
  try {
    const { userOrEmail, password } = req.body;

    const users = await UsersModels.findOne({
      where: {
        [Op.or]: [{ username: userOrEmail }, { email: userOrEmail }],
      },
    });

    if (!users)
      return res.status(404).json({ error: "Users tidak ditemukan!" });

    const matchPassword = await argon2.verify(users.password, password);

    if (!matchPassword)
      return res.status(403).json({ error: "Password tidak sama!" });

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
      secure: true,
      sameSite: "none",
      maxAge: 168 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Berhasil",
      token,
      users: {
        id: users.id,
        username: users.username,
        email: users.email,
        profile: users.profile,
        role: users.role,
        status: users.status,
        is_verified: users.is_verified,
        phone_number: users.phone_number,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
