// backend/models/employeeModel.js
import db from "../config/db.js";

export const getAllEmployees = async () => {
  const [rows] = await db.query("SELECT * FROM ksn_function_hall_employee ORDER BY emp_id DESC");
  return rows;
};

export const getEmployeeById = async (id) => {
  const [rows] = await db.query("SELECT * FROM ksn_function_hall_employee WHERE emp_id = ?", [id]);
  return rows[0];
};

export const createEmployee = async ({ emp_name, emp_email, emp_phone, emp_role, username, password_hash }) => {
  const [result] = await db.query(
    "INSERT INTO ksn_function_hall_employee (emp_name, emp_email, emp_phone, emp_role, username, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
    [emp_name, emp_email, emp_phone, emp_role, username, password_hash]
  );
  return result;
};

export const updateEmployee = async (id, data) => {
  const fields = [];
  const values = [];

  for (let key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  values.push(id);

  const [result] = await db.query(
    `UPDATE ksn_function_hall_employee SET ${fields.join(", ")} WHERE emp_id = ?`,
    values
  );

  return result;
};

export const deleteEmployee = async (id) => {
  const [result] = await db.query("DELETE FROM ksn_function_hall_employee WHERE emp_id = ?", [id]);
  return result;
};
