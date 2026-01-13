import express from "express";
import { listVendors, createVendor, editVendor, removeVendor } from "../controllers/vendorController.js";

const router = express.Router();

router.get("/", listVendors);
router.post("/", createVendor);
router.put("/:id", editVendor);
router.delete("/:id", removeVendor);

export default router;
