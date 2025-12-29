import { createAllColors, getColors } from "../controllers/colors.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import express from "express";

const colorsRouter = express.Router();

colorsRouter.get("/colors", getColors);
colorsRouter.post("/colors", verifyToken, verifyAdmin, createAllColors);

export default colorsRouter;
