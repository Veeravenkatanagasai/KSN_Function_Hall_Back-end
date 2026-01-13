import db from "../config/db.js"; 
import cron from "node-cron";
import * as paymentModel from "../models/paymentModel.js";
import { generatePDFReceipt } from "../utility/receipts/pdf.js";

// Get booking details
export const getBooking = async (req, res) => {
  try {
    const data = await paymentModel.getBookingDetails(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save payment (Advance/Balance/Full)
export const createPayment = async (req, res) => {
  try {
    const { booking_id, payment_type, payment_method, paid_amount, balance_days } = req.body;

    if (!booking_id || !payment_type || !payment_method || !paid_amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await paymentModel.getBookingDetails(booking_id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.booking_status === "CANCELLED") {
      return res.status(400).json({ error: "Cannot pay for CANCELLED booking" });
    }

    const totalAmount = booking.gross_total_before_discount;
    const balanceAmount = totalAmount - paid_amount;

    // Save payment
    const paymentId = await paymentModel.savePayment({
      booking_id,
      payment_type,
      payment_method,
      total_amount: totalAmount,
      paid_amount,
      balance_amount: balanceAmount,
      transaction_status: "SUCCESS"
    });

    // Update booking status and set balance due date if ADVANCE
    let newStatus = "INPROGRESS";
    let dueDays = 0;

    if (payment_type.toUpperCase() === "ADVANCE") {
      newStatus = "ADVANCE";
      dueDays = Number(balance_days) || 3; // default 3 days

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + dueDays);

      await db.query(
        `UPDATE ksn_function_hall_bookings 
         SET booking_status = ?, balance_due_date = ? 
         WHERE booking_id = ?`,
        [newStatus, dueDate, booking_id]
      );
    } else {
      // FULL payment
      await db.query(
        `UPDATE ksn_function_hall_bookings 
         SET booking_status = ? 
         WHERE booking_id = ?`,
        [newStatus, booking_id]
      );
    }

    // Generate PDF receipt
    await generatePDFReceipt(booking_id);

    res.json({
      message: "Payment saved successfully",
      paymentId,
      balanceAmount,
      booking_status: newStatus,
      balance_due_days: dueDays
    });

  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// Cron Job: Cancel bookings after balance due date


export const scheduleBookingExpiry = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const [rows] = await db.query(`
        SELECT booking_id 
        FROM ksn_function_hall_bookings
        WHERE booking_status = 'ADVANCE'
          AND balance_due_date < NOW()
      `);

      if (rows.length) {
        const bookingIds = rows.map(r => r.booking_id);
        await db.query(`
          UPDATE ksn_function_hall_bookings
          SET booking_status = 'CANCELLED'
          WHERE booking_id IN (?)
        `, [bookingIds]);

        console.log("Cancelled bookings:", bookingIds.join(", "));
      }
    } catch (err) {
      console.error("Booking expiry cron error:", err);
    }
  });
};

export const payRemainingBalance = async (req, res) => {
  const { bookingId } = req.params;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    /* 1️⃣ Lock payment row */
    const [[payment]] = await conn.query(
      `SELECT *
       FROM ksn_function_hall_payments
       WHERE booking_id = ?
       FOR UPDATE`,
      [bookingId]
    );

    if (!payment) {
      await conn.rollback();
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.balance_amount <= 0) {
      await conn.rollback();
      return res.status(400).json({ message: "No balance remaining" });
    }

    const balance = Number(payment.balance_amount);

    /* 2️⃣ Update payment */
    await conn.query(`
      UPDATE ksn_function_hall_payments SET
        paid_amount = total_amount,
        balance_amount = 0,
        balance_paid_amount = ?,
        balance_paid_date = NOW(),
        balance_paid_status = 'clear'
      WHERE booking_id = ?
    `, [balance, bookingId]);

    /* 3️⃣ Update booking */
    await conn.query(`
      UPDATE ksn_function_hall_bookings SET
        booking_status = 'INPROGRESS',
        balance_due_date = NULL
      WHERE booking_id = ?
    `, [bookingId]);

    await conn.commit();

    res.json({
      message: "Balance payment completed successfully"
    });

  } catch (err) {
    await conn.rollback();
    console.error("BALANCE PAYMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
