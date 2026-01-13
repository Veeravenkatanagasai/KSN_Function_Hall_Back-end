// src/models/timeslot.model.js
import db from "../config/db.js";

export const TimeSlotModel = {
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM ksn_function_hall_timeslots ORDER BY created_at DESC"
    );
    return rows;
  },

  create: async (slot_name) => {
    return db.query(
      "INSERT INTO ksn_function_hall_timeslots (slot_name) VALUES (?)",
      [slot_name]
    );
  },

  update: async (id, slot_name) => {
    return db.query(
      "UPDATE ksn_function_hall_timeslots SET slot_name=? WHERE slot_id=?",
      [slot_name, id]
    );
  },

  remove: async (id) => {
    return db.query(
      "DELETE FROM ksn_function_hall_timeslots WHERE slot_id=?",
      [id]
    );
  }
};
