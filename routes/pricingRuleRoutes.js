import express from "express";
import { getPriceRule, getBlockedDates } from "../controllers/pricingRuleController.js";

const router = express.Router();

router.get("/price-rule", getPriceRule);
router.get("/blocked-dates",getBlockedDates);

export default router;
