import express from "express";
import upload from "../middleware/upload.js";
import { confirmBooking} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/confirm",
    upload.fields([
    { name: "aadharCustomer", maxCount: 1 },
    { name: "aadharBride", maxCount: 1 },
    { name: "aadharGroom", maxCount: 1 },
    { name: "weddingCard", maxCount: 1 },
  ]),
confirmBooking);

export default router;
