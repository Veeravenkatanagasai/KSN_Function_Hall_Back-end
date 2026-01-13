import bcrypt from "bcryptjs";
import {
  findEmployeeByEmail,
  updateLoginInfo,
  updateLogoutInfo
} from "../models/employeeauthModel.js";

export const login = async (req, res) => {
  const { emp_email, password } = req.body;

  const employee = await findEmployeeByEmail(emp_email);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const match = await bcrypt.compare(password, employee.password_hash);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  await updateLoginInfo(employee.emp_id);

  // ✅ SESSION STORED
  req.session.employee = {
    emp_id: employee.emp_id,
    emp_name: employee.emp_name,
    emp_role: employee.emp_role,
    emp_email: employee.emp_email
  };

  res.json({
    message: "Login successful",
    employee: req.session.employee
  });
};

export const logout = async (req, res) => {
  if (req.session.employee) {
    await updateLogoutInfo(req.session.employee.emp_id);
  }

  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
};
