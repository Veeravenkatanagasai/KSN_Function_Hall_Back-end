import express from "express";
import {
  listStaff,
  createStaff,
  editStaff,
  removeStaff
} from "../controllers/staffController.js";

const router = express.Router();

router.get("/", listStaff);
router.post("/", createStaff);
router.put("/:id", editStaff);
router.delete("/:id", removeStaff);

export default router;
