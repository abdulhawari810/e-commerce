import { Op } from "sequelize";
import {
  UsersModels,
  UsersAddressModels,
  ProductModels,
  ProductDetailsModels,
  CartsModels,
  CartItemsModels,
  WhislistModels,
  OrdersModels,
  OrdersItemsModels,
} from "../model/Relationship.js";

export const getUsers = async (req, res) => {};
export const getUsersById = async (req, res) => {};
export const updateUsers = async (req, res) => {};
export const deleteUsers = async (req, res) => {};
export const checkUsers = async (req, res) => {
  const { username } = req.query;

  const exists = await UsersModels.findOne({
    where: { username },
  });

  const unsafeWords = ["admin", "administrator", "superadmin"];

  const lower = username.toLowerCase();

  if (unsafeWords.some((word) => lower.includes(word))) {
    return res.json({ exists: true });
  }

  const adminPattern = /a[d|ɖ|cl|đ]m[i|1|l]n/;

  if (adminPattern.test(lower)) {
    return res.json({ exists: true });
  }

  if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
    return res.status(400).json({
      error: "Format username tidak valid",
    });
  }

  res.json({ exists: !!exists });
};
export const Me = async (req, res) => {
  try {
    const users = req.user;
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logout Berhasil!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
