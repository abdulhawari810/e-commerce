import {
  getCart,
  createCart,
  deleteCart,
  getCountCart,
  createCartSync,
  updateCartQty,
  getCartGuest,
} from "../controllers/carts.js";
import { verifyToken } from "../middleware/auth.js";
import express from "express";

const cartRouter = express.Router();

cartRouter.get("/cart", verifyToken, getCart);
cartRouter.post("/cart/guest", getCartGuest);
cartRouter.get("/cart/count", verifyToken, getCountCart);
cartRouter.post("/cart", verifyToken, createCart);
cartRouter.patch("/cart/:productId", verifyToken, updateCartQty);
cartRouter.post("/cart/sync", verifyToken, createCartSync);
cartRouter.delete("/cart/:productId", verifyToken, deleteCart);

export default cartRouter;
