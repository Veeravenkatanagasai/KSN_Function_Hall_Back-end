import { getAllVendors, addVendor, updateVendor, deleteVendor } from "../models/vendorModel.js";

export const listVendors = async (req, res) => {
  try {
    const vendors = await getAllVendors();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createVendor = async (req, res) => {
  try {
    const id = await addVendor(req.body);
    res.json({ message: "Vendor added", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editVendor = async (req, res) => {
  try {
    await updateVendor(req.params.id, req.body);
    res.json({ message: "Vendor updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeVendor = async (req, res) => {
  try {
    await deleteVendor(req.params.id);
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
