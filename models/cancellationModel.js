import db from "../config/db.js";

// Insert cancellation record
export const createCancellation = async ({
  bookingId,
  paymentId,
  penalty_percent,
  total_amount,
  penalty_amount,
  refund_amount,
}) => {
  await db.query(
    `
    INSERT INTO ksn_function_hall_cancellation_payments
    (booking_id, payment_id, total_amount, penalty_percent, penalty_amount, refund_amount)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [bookingId, paymentId, total_amount, penalty_percent, penalty_amount, refund_amount]
  );
};

// Get applicable rule based on days before event
export const getApplicableRule = async (daysBefore) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM ksn_function_hall_cancellation_rules
    WHERE is_active = 1
      AND days <= ?
    ORDER BY days DESC
    LIMIT 1
    `,
    [daysBefore]
  );
  return rows[0];
};


// Fetch cancellation details for a booking
export const getCancellationByBookingId = async (bookingId) => {
  const [rows] = await db.query(
    `SELECT 
        cancellation_id,
        booking_id,
        payment_id,
        penalty_percent,
        total_amount,
        penalty_amount,
        refund_amount,
        cancelled_at
     FROM ksn_function_hall_cancellation_payments
     WHERE booking_id = ?
     ORDER BY cancelled_at DESC
     LIMIT 1`,
    [bookingId]
  );
  return rows[0] || null;
};
