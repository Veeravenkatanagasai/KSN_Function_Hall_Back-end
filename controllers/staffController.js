import {
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff
} from "../models/staffModel.js";

export const listStaff = async (req, res) => {
  try {
    const staff = await getAllStaff();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const id = await addStaff(req.body);
    res.json({ message: "Staff added", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editStaff = async (req, res) => {
  try {
    await updateStaff(req.params.id, req.body);
    res.json({ message: "Staff updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeStaff = async (req, res) => {
  try {
    await deleteStaff(req.params.id);
    res.json({ message: "Staff deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
