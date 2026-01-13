// src/routes/hall.routes.js
import express from "express";
import {
  getHalls,
  addHall,
  updateHall,
  deleteHall
} from "../controllers/hallController.js";

const router = express.Router();

router.get("/", getHalls);
router.post("/", addHall);
router.put("/:id", updateHall);
router.delete("/:id", deleteHall);

export default router;
