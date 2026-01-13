import { fetchPriceRuleFromDB } from "../models/pricingRuleModel.js";
import db from "../config/db.js";

export const getPriceRule = async (req, res) => {
  try {
    const { category, hall, timeSlot, date } = req.query;

    if (!category || !hall || !timeSlot || !date) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const rule = await fetchPriceRuleFromDB(
      category,
      hall,
      timeSlot,
      date
    );

    if (!rule) {
      return res.status(404).json({ error: "No price rule found" });
    }

    res.json({
      start_time: rule.start_time,
      end_time: rule.end_time,
      base_price_per_hour: rule.base_price_per_hour,
      discount_percent: rule.discount_percent,
      advance_percent: rule.advance_percent,
    });
  } catch (err) {
    console.error("Price rule error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getBlockedDates = async (req, res) => {
  const {hall, timeSlot } = req.query;

  if (!hall || !timeSlot) {
    return res.json([]);
  }

  const [rows] = await db.query(
    `
    SELECT event_date
    FROM ksn_function_hall_bookings
    WHERE hall = ?
      AND time_slot = ?
    `,
    [hall, timeSlot]
  );

  res.json(rows.map(r => r.event_date));
};