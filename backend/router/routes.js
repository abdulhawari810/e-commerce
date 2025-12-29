import express from "express";
import rateLimit from "express-rate-limit";

import {
  getUsers,
  getUsersById,
  updateUsers,
  deleteUsers,
  checkUsers,
  Me,
  Logout,
} from "./../controller/users.js";
import {
  getWhislist,
  getWhislistById,
  updateWhislist,
  deleteWhislist,
} from "./../controller/whislist.js";
import {
  getProducts,
  getProductsById,
  updateProducts,
  deleteProducts,
  createAllProduct,
} from "./../controller/product.js";
import {
  getCarts,
  getCartsById,
  createCartsByUsers,
  countCartsById,
  updateQty,
  removeCartItem,
} from "./../controller/cart.js";
import {
  getOrders,
  getOrdersById,
  updateOrders,
  deleteOrders,
} from "./../controller/order.js";
import { Login, Register } from "../controller/Auth.js";
import { verifyAdmin, verifyToken } from "./../middleware/auth.js";

const router = express.Router();

const checkLimit = rateLimit({
  windowMs: 3600 * 1000,
  max: 1000,
  message: { error: "Terlalu banyak request, coba lagi nanti." },
});

// router auth

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);

// router users

router.get("/Me", verifyToken, Me);
router.delete("/users/:id", verifyToken, Logout);
router.get("/check-users", checkLimit, checkUsers);
router.get("/users", getUsers);
router.get("/users/:id", getUsersById);
router.patch("/users/:id", updateUsers);
router.delete("/users/:id", deleteUsers);

// router orders
router.get("/orders", getOrders);
router.get("/orders/:id", getOrdersById);
router.patch("/orders/:id", updateOrders);
router.delete("/orders/:id", deleteOrders);

// router Whislist
router.get("/whislist", getWhislist);
router.get("/whislist/:id", getWhislistById);
router.patch("/whislist/:id", updateWhislist);
router.delete("/whislist/:id", deleteWhislist);

// router Products
router.get("/products", getProducts);
router.get("/products/:id", getProductsById);
router.post("/created", verifyToken, verifyAdmin, createAllProduct);
router.patch("/products/:id", updateProducts);
router.delete("/products/:id", deleteProducts);

// router Carts
router.get("/carts", getCarts);
router.get("/cart/count", countCartsById);
router.get("/carts/userId", getCartsById);
router.post("/carts", verifyToken, createCartsByUsers);
router.post("/carts/updated", verifyToken, updateQty);
router.post("/carts/deleted", verifyToken, removeCartItem);

export default router;
