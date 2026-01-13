import db from "../config/db.js";
import { getBookingById, updateBookingStatus } from "../models/bookingModel.js";
import { getPaymentByBookingId } from "../models/paymentModel.js";
import { createCancellation, getApplicableRule, getCancellationByBookingId } from "../models/cancellationModel.js";

export const cancelBooking = async (req, res) => {
  const bookingId = req.params.bookingId;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Fetch booking
    const booking = await getBookingById(bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.booking_status === "CANCELLED") throw new Error("Booking already cancelled");

    // 2️⃣ Calculate days before event
    const eventDate = new Date(booking.event_date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysBefore = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

    // 3️⃣ Fetch applicable cancellation rule
    const rule = await getApplicableRule(daysBefore);
    if (!rule) throw new Error("No cancellation rule configured");

    // 4️⃣ Fetch payment info
    const payment = await getPaymentByBookingId(bookingId);
    if (!payment) throw new Error("No payment found");
    const paidAmount = Number(payment.paid_amount);
    if (isNaN(paidAmount) || paidAmount <= 0) throw new Error("Invalid paid amount");

    // 5️⃣ Calculate penalty and refund
    const penaltyAmount = Number(((paidAmount * rule.penalty_percent) / 100).toFixed(2));
    const refundAmount = Number((paidAmount - penaltyAmount).toFixed(2));

    

    // 6️⃣ Insert cancellation record
    await createCancellation({
      bookingId,
      paymentId: payment.payment_id,
      total_amount: paidAmount,
      penalty_percent: rule.penalty_percent,
      penalty_amount: penaltyAmount,
      refund_amount: refundAmount,
    });

    // 7️⃣ Update booking status
    await updateBookingStatus(bookingId, "CANCELLED");

    await conn.commit();

    res.json({
      success: true,
      bookingId,
      total_amount: paidAmount,
      penalty_percent: rule.penalty_percent,
      penalty_amount: penaltyAmount,
      refund_amount: refundAmount,
      message: "Booking cancelled successfully",
    });

  } catch (err) {
    await conn.rollback();
    console.error("Cancellation error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};

// Get cancellation details
export const getCancellationDetails = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const data = await getCancellationByBookingId(bookingId);
    if (!data) return res.status(404).json({ message: "No cancellation record found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
