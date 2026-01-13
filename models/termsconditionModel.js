import db from "../config/db.js";

export const getAllTerms = async () => {
  const [rows] = await db.query("SELECT * FROM ksn_function_hall_terms_conditions");
  return rows;
};

export const addTerm = async (en, te) => {
  const [res] = await db.query(
    "INSERT INTO ksn_function_hall_terms_conditions (terms_text_en, terms_text_te) VALUES (?, ?)",
    [en, te]
  );
  return res;
};

export const updateTerm = async (id, en, te) => {
  const [res] = await db.query(
    "UPDATE ksn_function_hall_terms_conditions SET terms_text_en=?, terms_text_te=? WHERE terms_id=?",
    [en, te, id]
  );
  return res;
};

export const deleteTerm = async (id) => {
  const [res] = await db.query(
    "DELETE FROM ksn_function_hall_terms_conditions WHERE terms_id=?",
    [id]
  );
  return res;
};
