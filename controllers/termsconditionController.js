import * as Terms from "../models/termsconditionModel.js";

export const getTerms = async (req, res) => {
  try {
    const terms = await Terms.getAllTerms();
    res.json(terms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTerm = async (req, res) => {
  try {
    const { en, te } = req.body;
    await Terms.addTerm(en, te);
    res.json({ message: "Term added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editTerm = async (req, res) => {
  try {
    const { id, en, te } = req.body;
    await Terms.updateTerm(id, en, te);
    res.json({ message: "Term updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeTerm = async (req, res) => {
  try {
    const { id } = req.params;
    await Terms.deleteTerm(id);
    res.json({ message: "Term deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
