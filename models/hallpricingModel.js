import db from "../config/db.js";

const PricingModel = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        rule_id,
        category_name,
        hall_name,
        time_slot,
        TIME_FORMAT(start_time, '%H:%i') AS start_time,
        TIME_FORMAT(end_time, '%H:%i') AS end_time,
        base_price_per_hour,
        discount_percent,
        advance_percent,
        DATE(from_date) AS from_date,
        DATE(to_date) AS to_date
      FROM ksn_function_hall_prices
      ORDER BY created_at DESC
    `);
    return rows;
  },

  create: async (data) => {
    const { category_name, hall_name, time_slot, start_time, end_time,
      base_price_per_hour, discount_percent, advance_percent, from_date, to_date } = data;

    return db.query(
      `INSERT INTO ksn_function_hall_prices
        (category_name, hall_name, time_slot, start_time, end_time, base_price_per_hour, discount_percent, advance_percent, from_date, to_date)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [category_name, hall_name, time_slot, start_time, end_time, base_price_per_hour, discount_percent, advance_percent, from_date, to_date]
    );
  },

  update: async (id, data) => {
    const start_time = data.start_time ? data.start_time + ":00" : null;
    const end_time = data.end_time ? data.end_time + ":00" : null;

    return db.query(
      `UPDATE ksn_function_hall_prices SET 
        category_name = ?, hall_name = ?, time_slot = ?, base_price_per_hour = ?, discount_percent = ?, advance_percent = ?, start_time = ?, end_time = ?, from_date = ?, to_date = ?
       WHERE rule_id = ?`,
      [data.category_name, data.hall_name, data.time_slot, data.base_price_per_hour, data.discount_percent, data.advance_percent, start_time, end_time, data.from_date, data.to_date, id]
    );
  },

  remove: async (id) => {
    return db.query(`DELETE FROM ksn_function_hall_prices WHERE rule_id = ?`, [id]);
  }
};

export default PricingModel;
