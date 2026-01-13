import express from "express";
import {
  listServices,
  createService,
  editService,
  removeService
} from "../controllers/servicesController.js";

const router = express.Router();

router.get("/", listServices);
router.post("/", createService);
router.put("/:id", editService);
router.delete("/:id", removeService);

export default router;
