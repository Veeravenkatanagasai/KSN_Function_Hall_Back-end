// routes/adminRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/datefiltercontroller.js";

const router = express.Router();

router.get("/dashboard", getDashboardStats);

export default router;
