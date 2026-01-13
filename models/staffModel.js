import db from "../config/db.js";

export const getAllStaff = async () => {
  const [rows] = await db.query("SELECT * FROM ksn_function_hall_staff");
  return rows;
};

export const addStaff = async (data) => {
  const { name, role, email, phone, salary, join_date, status } = data;

  const [result] = await db.query(
    `INSERT INTO ksn_function_hall_staff 
     (name, role, email, phone, salary, join_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, role, email, phone, salary, join_date, status || "Active"]
  );

  return result.insertId;
};

export const updateStaff = async (id, data) => {
  const { name, role, email, phone, salary, join_date, status } = data;

  await db.query(
    `UPDATE ksn_function_hall_staff 
     SET name=?, role=?, email=?, phone=?, salary=?, join_date=?, status=?
     WHERE id=?`,
    [name, role, email, phone, salary, join_date, status, id]
  );
};

export const deleteStaff = async (id) => {
  await db.query("DELETE FROM ksn_function_hall_staff WHERE id=?", [id]);
};
