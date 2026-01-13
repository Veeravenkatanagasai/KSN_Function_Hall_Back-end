import { db } from "../config/db.js";

export const findAdminByEmail = (email, cb) => {
  db.query("SELECT * FROM ksn_function_hall_admins WHERE email = ?", [email], cb);
};

export const createAdmin = (data, cb) => {
  db.query("INSERT INTO ksn_function_hall_admins SET ?", data, cb);
};
