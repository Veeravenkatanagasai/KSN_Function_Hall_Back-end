import FixedChargesModel from "../models/fixedChargesModel.js";
import CategoryModel from "../models/categoryModel.js";

export const getAllCharges = async (req, res) => {
  try {
    const charges = await FixedChargesModel.getAll();
    res.json(charges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCharge = async (req, res) => {
  try {
    const result = await FixedChargesModel.create(req.body);
    res.json({ message: "Charge added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCharge = async (req, res) => {
  try {
    await FixedChargesModel.update(req.params.id, req.body);
    res.json({ message: "Charge updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCharge = async (req, res) => {
  try {
    await FixedChargesModel.delete(req.params.id);
    res.json({ message: "Charge deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.getAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
