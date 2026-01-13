import express from "express";
import * as controller from "../controllers/cancellationRuleController.js";

const router = express.Router();

router.get("/", controller.getRules);
router.get("/:id", controller.getRule);
router.post("/", controller.addRule);
router.put("/:id", controller.editRule);
router.delete("/:id", controller.removeRule);

export default router;
