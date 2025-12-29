import {
  getWhislist,
  createWhislist,
  deleteWhislist,
} from "../controllers/whislist.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import express from "express";

const whislistRouter = express.Router();

whislistRouter.get("/whislist", verifyToken, getWhislist);
whislistRouter.post("/whislist", verifyToken, createWhislist);
whislistRouter.delete("/whislist/:productId", verifyToken, deleteWhislist);

export default whislistRouter;
