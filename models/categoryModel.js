import db from "../config/db.js";

const CategoryModel = {
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM ksn_function_hall_categories ORDER BY created_at DESC"
    );
    return rows;
  },

  create: async (category_name) => {
    const [result] = await db.query(
      "INSERT INTO ksn_function_hall_categories (category_name) VALUES (?)",
      [category_name]
    );
    return result;
  },

  update: async (id, category_name) => {
    return db.query(
      "UPDATE ksn_function_hall_categories SET category_name=? WHERE category_id=?",
      [category_name, id]
    );
  },

  remove: async (id) => {
    return db.query(
      "DELETE FROM ksn_function_hall_categories WHERE category_id=?",
      [id]
    );
  }
};

export default CategoryModel;
