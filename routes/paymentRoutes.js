// routes/paymentRoutes.js
import express from "express";
import { getBooking, createPayment
,payRemainingBalance,scheduleBookingExpiry 
 } from "../controllers/paymentController.js";


const router = express.Router();

router.get("/booking/:id", getBooking);
router.post("/", createPayment);

// Start cron for automatic expiry
scheduleBookingExpiry();


router.post("/pay-balance/:bookingId",payRemainingBalance);


export default router;
