import express from "express";
import { listReferrals, payReferralCommission } from "../controllers/referralCommissionController.js";

const router = express.Router();

router.get("/", listReferrals);
router.post("/pay", payReferralCommission);

export default router;
