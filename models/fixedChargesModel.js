import db from "../config/db.js";

const FixedChargesModel = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT c.charges_id, c.charges_name, c.charges_value, c.category_id, cat.category_name
      FROM ksn_function_hall_fixed_charges c
      JOIN ksn_function_hall_categories cat ON c.category_id = cat.category_id
      ORDER BY c.created_at DESC
    `);
    return rows;
  },

  create: async (data) => {
    const { category_id, charges_name, charges_value } = data;
    const [result] = await db.query(
      "INSERT INTO ksn_function_hall_fixed_charges (category_id, charges_name, charges_value) VALUES (?, ?, ?)",
      [category_id, charges_name, charges_value]
    );
    return result;
  },

  update: async (id, data) => {
    const { category_id, charges_name, charges_value } = data;
    return db.query(
      "UPDATE ksn_function_hall_fixed_charges SET category_id=?, charges_name=?, charges_value=? WHERE charges_id=?",
      [category_id, charges_name, charges_value, id]
    );
  },

  delete: async (id) => {
    return db.query(
      "DELETE FROM ksn_function_hall_fixed_charges WHERE charges_id=?",
      [id]
    );
  }
};

export default FixedChargesModel;
