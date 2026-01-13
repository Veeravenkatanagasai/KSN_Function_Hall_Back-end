import { getPriceRuleForInvoice } from "../models/invoiceModel.js";

export const generateInvoice = async (req, res) => {
  try {
    const {
      category,
      hall,
      timeSlot,
      eventDate,
      duration,
      discount = 0,
    } = req.body;

    if (!category || !hall || !timeSlot || !eventDate || !duration) {
      return res.status(400).json({ message: "Missing invoice fields" });
    }

    const pricing = await getPriceRuleForInvoice({
      category,
      hall,
      timeSlot,
      eventDate,
    });

    if (!pricing) {
      return res.status(404).json({ message: "Price rule not found" });
    }

    const hours = Number(duration);

    const baseAmount = hours * pricing.base_price_per_hour;

    const fixedCharges = (pricing.fixedCharges || [])
      .filter(f => f.charges_name && f.charges_name.trim() !== "")
      .map(f => ({
        name: f.charges_name,
        amount: Number(f.charges_value) || 0,
      }));

    const fixedChargeAmount = fixedCharges.reduce((sum, f) => sum + f.amount, 0);

    // Utilities – only with names
    const utilities = (pricing.utilities || [])
      .filter(u => u.utility_name && u.utility_name.trim() !== "")
      .map(u => ({
        name: u.utility_name,
        rate: Number(u.price_per_hour) || 0,
        hours: Number(u.default_hours) || 0,
        amount: (Number(u.price_per_hour) || 0) * (Number(u.default_hours) || 0),
      }));



    const gross = baseAmount + fixedChargeAmount;
    const discountAmount = (gross * discount) / 100;
    const grandTotal = gross - discountAmount;

    res.json({
      base_price_per_hour: pricing.base_price_per_hour,
      hours,
      baseAmount,
      fixedCharges,
      fixedChargeAmount,
      utilities,
      discount,
      discountAmount,
      grandTotal,
    });
  } catch (err) {
    console.error("Invoice generation error:", err);
    res.status(500).json({ message: "Invoice failed" });
  }
};
