import PricingModel from "../models/hallpricingModel.js";

// Get all pricing rules
export const getAllPricing = async (req, res) => {
  try {
    const data = await PricingModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pricing" });
  }
};

// Add pricing rule
export const addPricing = async (req, res) => {
  try {
    await PricingModel.create(req.body);
    res.json({ message: "Pricing added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add pricing" });
  }
};

// Update pricing rule
export const updatePricing = async (req, res) => {
  try {
    await PricingModel.update(req.params.id, req.body);
    res.json({ message: "Pricing updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update pricing" });
  }
};

// Delete pricing rule
export const deletePricing = async (req, res) => {
  try {
    await PricingModel.remove(req.params.id);
    res.json({ message: "Pricing deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete pricing" });
  }
};
