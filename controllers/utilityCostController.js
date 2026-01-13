import * as Utility from "../models/utilityCostModel.js";

export const getUtilities = async (req, res) => {
  try {

    const data = await Utility.getAllUtilities();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addUtility = async (req, res) => {
  try {

    await Utility.createUtility(req.body);

    res.json({ message: "Utility added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUtility = async (req, res) => {
  try {

    await Utility.updateUtility(req.params.id, req.body);

    res.json({ message: "Utility updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUtility = async (req, res) => {
  try {

    await Utility.deleteUtility(req.params.id);

    res.json({ message: "Utility deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
