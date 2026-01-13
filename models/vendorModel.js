import db from "../config/db.js";

export const getAllVendors = async () => {
  const [rows] = await db.query("SELECT * FROM ksn_function_hall_vendors ORDER BY vendor_id DESC");
  return rows;
};

export const addVendor = async (data) => {
  const { vendor_name, vendor_category, vendor_address, phone, email } = data;
  const [result] = await db.query(
    `INSERT INTO ksn_function_hall_vendors 
    (vendor_name, vendor_category, vendor_address, phone, email)
    VALUES (?, ?, ?, ?, ?)`,
    [vendor_name, vendor_category, vendor_address, phone, email]
  );
  return result.insertId;
};

export const updateVendor = async (id, data) => {
  const { vendor_name, vendor_category, vendor_address, phone, email } = data;
  await db.query(
    `UPDATE ksn_function_hall_vendors 
     SET vendor_name=?, vendor_category=?, vendor_address=?, phone=?, email=?
     WHERE vendor_id=?`,
    [vendor_name, vendor_category, vendor_address, phone, email, id]
  );
};

export const deleteVendor = async (id) => {
  await db.query("DELETE FROM ksn_function_hall_vendors WHERE vendor_id=?", [id]);
};
