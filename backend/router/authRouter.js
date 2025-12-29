import express from "express";
import { Login, Logout, Me, Register, sendOTP } from "../controllers/auth.js";
import { verifyAdmin, verifyToken } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/send/otp", sendOTP);
authRouter.get("/Me", verifyToken, Me);
authRouter.post("/logout", verifyToken, Logout);

export default authRouter;
