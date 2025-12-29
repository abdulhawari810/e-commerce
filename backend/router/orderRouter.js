import {
  createOrders,
  deleteOrders,
  getOrders,
  updateOrders,
} from "../controllers/orders.js";
import { verifyToken } from "../middleware/auth.js";
import express from "express";

const orderRouter = express.Router();

// router for users and admin

orderRouter.get("/orders", verifyToken, getOrders);
orderRouter.post("/orders", verifyToken, createOrders);
orderRouter.patch("/orders/:id", verifyToken, updateOrders);
orderRouter.delete("/orders/:id", verifyToken, deleteOrders);

export default orderRouter;
