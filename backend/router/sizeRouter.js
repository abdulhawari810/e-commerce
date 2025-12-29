import express from "express";
import { getSize, createAllSize } from "../controllers/size.js";
import { verifyAdmin, verifyToken } from "../middleware/auth.js";

const sizeRouter = express.Router();

sizeRouter.get("/size", getSize);
sizeRouter.post("/size", verifyToken, verifyAdmin, createAllSize);

export default sizeRouter;
