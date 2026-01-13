import db from "../config/db.js";

export const getAllUtilities = async () => {
  try {

    const sql = `
      SELECT u.*, c.category_name
      FROM ksn_function_hall_utility_costs u
      JOIN ksn_function_hall_categories c
        ON u.category_id = c.category_id
      ORDER BY u.utility_id DESC
    `;

    const [rows] = await db.query(sql);
    return rows;
  } catch (err) {
    console.error("[DB ERROR] getAllUtilities:", err);
    throw err;
  }
};

export const createUtility = async (data) => {
  try {

    const sql = `
      INSERT INTO ksn_function_hall_utility_costs
      (utility_name, category_id, price_per_hour, default_hours)
      VALUES (?,?,?,?)
    `;

    await db.query(sql, [
      data.utility_name,
      data.category_id,
      data.price_per_hour,
      data.default_hours || 0,
    ]);

  } catch (err) {
    console.error("[DB ERROR] createUtility:", err);
    throw err;
  }
};

export const updateUtility = async (id, data) => {
  try {

    const sql = `
      UPDATE ksn_function_hall_utility_costs
      SET utility_name=?, category_id=?, price_per_hour=?, default_hours=?
      WHERE utility_id=?
    `;

    await db.query(sql, [
      data.utility_name,
      data.category_id,
      data.price_per_hour,
      data.default_hours || 0,
      id,
    ]);

  } catch (err) {
    console.error("[DB ERROR] updateUtility:", err);
    throw err;
  }
};

export const deleteUtility = async (id) => {
  try {

    await db.query(
      "DELETE FROM ksn_function_hall_utility_costs WHERE utility_id=?",
      [id]
    );
  } catch (err) {
    console.error("[DB ERROR] deleteUtility:", err);
    throw err;
  }
};

export const getUtilityCost = async (utility_name) => {
  const [rows] = await db.query(
    "SELECT price_per_hour FROM ksn_function_hall_utility_costs WHERE utility_name = ? LIMIT 1",
    [utility_name]
  );
  return rows[0];
};

