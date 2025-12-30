import jwt from "jsonwebtoken";
import UsersModels from "../models/UsersModel.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1] || null;

    if (!token) {
      return res.status(401).json({ error: "Token tidak ditemukan" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UsersModels.findByPk(decoded.id, {
      attributes: [
        "id",
        "phone",
        "username",
        "email",
        "role",
        "is_active",
        "is_verified",
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    return res.status(403).json({ error: "Token tidak valid" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Akses ditolak!" });
  }

  next();
};
