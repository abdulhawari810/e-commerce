import { Op } from "sequelize";
import { UsersModel } from "../models/relationship.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.kimit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await UsersModel.findAndCountAll({
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    if (rows?.length === null)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "users not found" });

    res.status(200).json({
      users: rows,
      pagination: {
        totalData: count,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
export const getUsersById = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await UsersModel.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!users)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Users not found" });

    res
      .status(200)
      .json({ success: true, code: 200, message: "Users found", users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const createUsers = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      is_verified,
      is_active,
      role,
      profile,
      address,
      city,
      gender,
    } = req.body;

    let error = [];

    const users = await UsersModel.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (users?.username === username) {
      error.push("Username has been used!");
    }

    if (users?.email === email) {
      error.push("Email Address has been used!");
    }
    if (users?.phone === phone) {
      error.push("Phone Number has been used!");
    }

    if (error.length > 0) {
      return res.status(403).json({ error: true, code: 403, meesage: error });
    }

    const hash = await argon2.hash(password);

    await UsersModel.create({
      username: username ?? null,
      email: email ?? null,
      password: hash,
      phone: phone ?? null,
      role: role ?? users,
      is_active: is_active ?? false,
      is_verified: is_verified ?? false,
      address: address ?? null,
      city: city ?? null,
      gender: gender ?? null,
      profile: profile ?? "default.png",
    });
    res.status(201).json({
      success: true,
      code: 201,
      message: "Create Users SuccessFully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      password,
      phone,
      role,
      is_active,
      is_verified,
      address,
      gender,
      city,
      profile,
    } = req.body;

    const users = await UsersModel.findOne({ where: { id } });

    if (!users) {
      return res.status(404).json({
        error: true,
        code: 404,
        message: "Users Not Found",
      });
    }

    // password logic
    let hashedPassword = users.password;
    if (password && !(await argon2.verify(users.password, password))) {
      hashedPassword = await argon2.hash(password);
    }

    await UsersModel.update(
      {
        username: username ?? users.username,
        email: email ?? users.email,
        password: hashedPassword,
        phone: phone ?? users.phone,
        role: role ?? users.role,
        is_active: is_active ?? users.is_active,
        is_verified: is_verified ?? users.is_verified,
        address: address ?? users.address,
        city: city ?? users.city,
        profile: profile ?? users.profile,
        gender: gender ?? users.gender,
      },
      { where: { id } }
    );

    res.status(200).json({
      success: true,
      code: 200,
      message: "Users Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUsers = await UsersModel.findAll();

    const users = await UsersModel.findOne({
      where: {
        id,
      },
    });

    if (existingUsers?.length === 1 && users.role === "admin")
      return res
        .status(400)
        .json({ error: true, code: 400, message: "Users not deleted" });

    if (!users)
      return res
        .status(404)
        .json({ error: true, code: 404, message: "Users not found" });

    await UsersModel.destroy({ where: { id } });
    res
      .status(200)
      .json({ sucess: true, code: 200, message: "Users Deleted SuccessFully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
