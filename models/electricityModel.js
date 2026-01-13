import db from "../config/db.js";

// Fetch all in-progress bookings with per-unit costs
export const getBookingIdsWithCosts = async () => {
  const [rows] = await db.query(`
    SELECT 
      b.booking_id,
      (SELECT price_per_hour FROM ksn_function_hall_utility_costs WHERE utility_name='Electricity' LIMIT 1) AS current_per_unit_cost,
      (SELECT price_per_hour FROM ksn_function_hall_utility_costs WHERE utility_name='Generator' LIMIT 1) AS generator_per_unit_cost
    FROM ksn_function_hall_bookings b
    WHERE booking_status='INPROGRESS'
  `);
  return rows;
};

// Insert electricity bill safely
export const createElectricityBill = async (data) => {
  const sql = `
    INSERT INTO ksn_function_hall_electricity_bills (
      booking_id,
      current_previous_reading_image,
      current_after_reading_image,
      current_previous_units,
      current_after_current_units,
      current_per_unit_cost,
      currnet_total_amount,
      generator_previous_reading_image,
      generator_after_reading_image,
      generator_previous_units,
      generator_after_units,
      generator_per_unit_cost,
      generator_total_amount,
      grand_total
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;
  await db.query(sql, data);
};

export const getElectricityBillByBookingId = async (bookingId) => {
  const [rows] = await db.query(
    `SELECT * 
     FROM ksn_function_hall_electricity_bills
     WHERE booking_id = ?`,
    [bookingId]
  );
  return rows[0];
};