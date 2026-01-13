import * as model from "../models/cancellationRuleModel.js";

// Get all rules
export const getRules = async (req, res) => {
  try {
    const rules = await model.getAllRules();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get rule by ID
export const getRule = async (req, res) => {
  try {
    const rule = await model.getRuleById(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }
    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create rule
export const addRule = async (req, res) => {
  try {
    const { days, penalty_percent } = req.body;

    if (days == null || penalty_percent == null) {
      return res.status(400).json({ message: "Days and penalty are required" });
    }

    const ruleId = await model.createRule(req.body);
    res.status(201).json({
      message: "Rule created successfully",
      rule_id: ruleId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update rule
export const editRule = async (req, res) => {
  try {
    await model.updateRule(req.params.id, req.body);
    res.json({ message: "Rule updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete rule
export const removeRule = async (req, res) => {
  try {
    await model.deleteRule(req.params.id);
    res.json({ message: "Rule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
