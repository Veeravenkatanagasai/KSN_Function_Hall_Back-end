// backend/controllers/employeeController.js
import * as Employee from "../models/employeeModel.js";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

export const profile = async (req, res) => {
  const [rows] = await db.query(
    "SELECT emp_id, emp_name, emp_email, emp_role, emp_phone,username,last_login, login_count FROM ksn_function_hall_employee WHERE emp_id=?",
    [req.session.employee.emp_id]
  );

  res.json(rows[0]);
};

// GET ALL
export const listEmployees = async (req, res) => {
  try {
    const rows = await Employee.getAllEmployees();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
export const getEmployee = async (req, res) => {
  try {
    const emp = await Employee.getEmployeeById(req.params.id);
    res.json(emp);
  } catch {
    res.status(500).json({ message: "Employee not found" });
  }
};

// ADD
export const addEmployee = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await Employee.createEmployee({ ...req.body, password_hash: hash });
    res.json({ message: "Employee added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateEmployee = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) {
      data.password_hash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }
    await Employee.updateEmployee(req.params.id, data);
    res.json({ message: "Employee updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const removeEmployee = async (req, res) => {
  try {
    await Employee.deleteEmployee(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
