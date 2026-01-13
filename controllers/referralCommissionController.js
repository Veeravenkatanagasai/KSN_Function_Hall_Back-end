import { getAllReferrals, payReferral } from "../models/referralCommissionModel.js";

export const listReferrals = async (req, res) => {
  try {
    const data = await getAllReferrals();
    res.json(data);
  } catch (err) {
    console.error("Error fetching referrals:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const payReferralCommission = async (req, res) => {
  try {
    const { referral_id, booking_id, amount } = req.body;
    if (!referral_id || !booking_id || !amount) {
      return res.status(400).json({ message: "Referral ID, Booking ID and Amount required" });
    }

    await payReferral({ referral_id, booking_id, amount });
    res.json({ message: "success" });
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
