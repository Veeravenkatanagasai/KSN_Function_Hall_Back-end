// routes/showDetailsRoutes.js
import express from "express";
import { getAllBookingDetails } from "../controllers/showDetailsController.js";

const router = express.Router();

// GET all booking details
router.get("/", getAllBookingDetails);

export default router;
