import db from "../config/db.js";

export const getAllContacts = async () => {
  const [rows] = await db.query(
    "SELECT * FROM ksn_function_hall_contacts ORDER BY contact_id DESC"
  );
  return rows;
};

export const createContact = async (data) => {
  const [result] = await db.query(
    "INSERT INTO ksn_function_hall_contacts (name, email, mobile, subject) VALUES (?, ?, ?, ?)",
    [data.name, data.email, data.mobile, data.subject]
  );
  return result;
};

export const updateContact = async (id, data) => {
  await db.query(
    "UPDATE ksn_function_hall_contacts SET name=?, email=?, mobile=?, subject=? WHERE contact_id=?",
    [data.name, data.email, data.mobile, data.subject, id]
  );
};

export const deleteContact = async (id) => {
  await db.query(
    "DELETE FROM ksn_function_hall_contacts WHERE contact_id=?",
    [id]
  );
};
