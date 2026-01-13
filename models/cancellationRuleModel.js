import db from "../config/db.js";

// Get all rules
export const getAllRules = async () => {
  const [rows] = await db.query(
    "SELECT * FROM ksn_function_hall_cancellation_rules ORDER BY rule_id DESC"
  );
  return rows;
};

// Get rule by ID
export const getRuleById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM ksn_function_hall_cancellation_rules WHERE rule_id = ?",
    [id]
  );
  return rows[0];
};

// ✅ Create new rule (FIXED)
export const createRule = async ({ days, penalty_percent, is_active = 1 }) => {
  const [result] = await db.query(
    `INSERT INTO ksn_function_hall_cancellation_rules 
     (days, penalty_percent, is_active)
     VALUES (?, ?, ?)`,
    [days, penalty_percent, is_active]
  );
  return result.insertId;
};

// Update rule
export const updateRule = async (id, { days, penalty_percent, is_active }) => {
  await db.query(
    `UPDATE ksn_function_hall_cancellation_rules
     SET days = ?, penalty_percent = ?, is_active = ?
     WHERE rule_id = ?`,
    [days, penalty_percent, is_active, id]
  );
};

// Delete rule
export const deleteRule = async (id) => {
  await db.query(
    "DELETE FROM ksn_function_hall_cancellation_rules WHERE rule_id = ?",
    [id]
  );
};
