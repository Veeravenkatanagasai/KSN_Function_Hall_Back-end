import express from "express";
import { fetchBookingIds, addElectricityBill,getElectricityBill } from "../controllers/electricityController.js";
import { upload } from "../middleware/electricityupload.js";

const router = express.Router();

// Get bookings
router.get("/booking-ids", fetchBookingIds);

router.get("/:bookingId", getElectricityBill);

// Create electricity bill with multiple file uploads
router.post(
  "/create",
  upload.fields([
    { name: "current_previous" },
    { name: "current_after" },
    { name: "generator_previous" },
    { name: "generator_after" },
  ]),
  addElectricityBill
);

export default router;
