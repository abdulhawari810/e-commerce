import express from "express";
import { getActivity } from "../controllers/activity.js";
import { verifyAdmin, verifyToken } from "../middleware/auth.js";

const activityRouter = express.Router();

activityRouter.get("/logs", verifyToken, verifyAdmin, getActivity);

export default activityRouter;
