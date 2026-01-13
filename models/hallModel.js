// src/models/hall.model.js
import db from "../config/db.js";

export const HallModel = {
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM ksn_function_hall_halls ORDER BY created_at DESC"
    );
    return rows;
  },

  create: async (hall_name) => {
    return db.query(
      "INSERT INTO ksn_function_hall_halls (hall_name) VALUES (?)",
      [hall_name]
    );
  },

  update: async (id, hall_name) => {
    return db.query(
      "UPDATE ksn_function_hall_halls SET hall_name=? WHERE hall_id=?",
      [hall_name, id]
    );
  },

  remove: async (id) => {
    return db.query(
      "DELETE FROM ksn_function_hall_halls WHERE hall_id=?",
      [id]
    );
  }
};
