import db from "../config/db.js";

/* GET ALL SERVICES WITH VENDOR DETAILS */
export const getAllServices = async () => {
  const [rows] = await db.query(`
    SELECT 
      s.service_id,
      s.service_name,
      s.service_description,
      v.vendor_id,
      v.vendor_name,
      v.vendor_category,
      v.phone
    FROM ksn_function_hall_services s
    JOIN ksn_function_hall_vendors v 
      ON s.vendor_id = v.vendor_id
    ORDER BY s.service_id DESC
  `);
  return rows;
};

/* ADD SERVICE */
export const addService = async (data) => {
  const { service_name, service_description, vendor_id } = data;

  const [result] = await db.query(
    `INSERT INTO ksn_function_hall_services 
     (service_name, service_description, vendor_id)
     VALUES (?, ?, ?)`,
    [service_name, service_description, vendor_id]
  );

  return result.insertId;
};

/* UPDATE SERVICE */
export const updateService = async (id, data) => {
  const { service_name, service_description, vendor_id } = data;

  await db.query(
    `UPDATE ksn_function_hall_services 
     SET service_name=?, service_description=?, vendor_id=?
     WHERE service_id=?`,
    [service_name, service_description, vendor_id, id]
  );
};

/* DELETE SERVICE */
export const deleteService = async (id) => {
  await db.query(
    "DELETE FROM ksn_function_hall_services WHERE service_id=?",
    [id]
  );
};
