import db from "../config/db.js";

// 🔑 Used for login
export const findEmployeeByEmail = async (emp_email) => {
  const [rows] = await db.query(
    "SELECT * FROM ksn_function_hall_employee WHERE emp_email = ?",
    [emp_email]
  );
  return rows[0];
};

export const updateLoginInfo = async (emp_id) => {
  await db.query(
    `
    UPDATE ksn_function_hall_employee
    SET login_count = login_count + 1,
        last_login = NOW()
    WHERE emp_id = ?
    `,
    [emp_id]
  );
};

export const updateLogoutInfo = async (emp_id) => {
  await db.query(
    `
    UPDATE ksn_function_hall_employee
    SET last_logout = NOW()
    WHERE emp_id = ?
    `,
    [emp_id]
  );
};
