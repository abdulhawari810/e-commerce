import {
  getUsers,
  getUsersById,
  createUsers,
  updateUsers,
  deleteUsers,
} from "../controllers/users.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import express from "express";

const userRouter = express.Router();

userRouter.get("/users", verifyToken, verifyAdmin, getUsers);
userRouter.get("/users/:id", verifyToken, verifyAdmin, getUsersById);
userRouter.post("/users", verifyToken, verifyAdmin, createUsers);
userRouter.patch("/users/:id", verifyToken, verifyAdmin, updateUsers);
userRouter.delete("/users/:id", verifyToken, verifyAdmin, deleteUsers);

export default userRouter;
