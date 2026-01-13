import express from "express";
import {
  getTimeSlots,
  addTimeSlot,
  updateTimeSlot,
  deleteTimeSlot
} from "../controllers/timeslotController.js";

const router = express.Router();

router.get("/", getTimeSlots);
router.post("/", addTimeSlot);
router.put("/:id", updateTimeSlot);
router.delete("/:id", deleteTimeSlot);

export default router;
