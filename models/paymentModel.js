// models/paymentModel.js
import db from "../config/db.js";

// Fetch booking details
export const getBookingDetails = async (bookingId) => {
  const [[row]] = await db.query(`
    SELECT 
      booking_id,
      gross_total_before_discount,
      booking_status,
      balance_due_date
    FROM ksn_function_hall_bookings
    WHERE booking_id = ?
  `, [bookingId]);
  return row;
};

// Save a payment (Advance / Balance / Full)
export const savePayment = async (data) => {
  const [result] = await db.query(`
    INSERT INTO ksn_function_hall_payments (
      booking_id,
      payment_type,
      payment_method,
      total_amount,
      paid_amount,
      balance_amount,
      transaction_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    data.booking_id,
    data.payment_type,
    data.payment_method,
    data.total_amount,
    data.paid_amount,
    data.balance_amount,
    data.transaction_status
  ]);

  return result.insertId;
};


// Fetch payments for a booking
export const getPaymentsByBooking = async (bookingId) => {
  const [rows] = await db.query(`
    SELECT * FROM ksn_function_hall_payments
    WHERE booking_id = ?
    ORDER BY created_at ASC
  `, [bookingId]);
  return rows;
};

// Fetch all payments (Admin dashboard)
// models/paymentModel.js
export const getAllPayments = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM ksn_function_hall_payments
    ORDER BY created_at DESC
  `);
  return rows;
};


export const getPaymentByBookingId = async (bookingId) => {
  const [rows] = await db.query(
    `SELECT * FROM ksn_function_hall_payments WHERE booking_id = ?`,
    [bookingId]
  );
  return rows[0];
};