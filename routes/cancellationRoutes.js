import express from "express";
import { cancelBooking, getCancellationDetails } from "../controllers/cancellationController.js";

const router = express.Router();

router.post("/cancel/:bookingId", cancelBooking);
router.get("/details/:bookingId", getCancellationDetails);

export default router;
