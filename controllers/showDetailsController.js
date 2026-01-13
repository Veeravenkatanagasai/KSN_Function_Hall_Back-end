// controllers/adminController.js
import db from "../config/db.js"; // MySQL connection

export const getAllBookingDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // 🔹 COUNT TOTAL BOOKINGS
    const [[{ total }]] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM ksn_function_hall_bookings
    `);

    // 🔹 GET BOOKINGS (LIMIT/OFFSET inserted directly)
    const [bookings] = await db.execute(`
      SELECT 
        b.booking_id,
        b.category,
        b.hall,
        b.time_slot,
        b.event_date,
        b.start_time,
        b.end_time,
        b.duration,
        b.discount_percent,
        b.discount_amount,
        b.hall_charge,
        b.fixed_charges_total,
        b.gross_total_before_discount,
        b.booking_status,
        b.booking_date,
        b.balance_due_date,

        c.customer_name,
        c.phone,
        c.alternate_phone,
        c.email,
        c.address,
        c.aadhar_customer_path,
        c.aadhar_bride_path,
        c.aadhar_groom_path,
        c.wedding_card_path,

        r.referral_id,
        r.referral_name,
        r.referral_mobileno,
        r.referral_email,
        r.status AS referral_status,

        -- PAYMENT
    p.payment_type,
    p.payment_method,
    p.paid_amount,
    p.balance_amount,
    p.transaction_status,
    p.balance_paid_amount,
    p.balance_paid_date,
    p.balance_paid_status

      FROM ksn_function_hall_bookings b
      JOIN ksn_function_hall_customer_details c ON c.customer_id = b.customer_id
      LEFT JOIN ksn_function_hall_referrals r ON r.referral_id = b.referral_id
      LEFT JOIN ksn_function_hall_payments p ON p.booking_id = b.booking_id
      ORDER BY b.booking_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    // 🔹 GET FIXED CHARGES AND UTILITIES PER BOOKING
    for (let booking of bookings) {
      // FIXED CHARGES
      const [fixed] = await db.execute(`
        SELECT fc.charges_name, fc.charges_value
        FROM ksn_function_hall_fixed_charges fc
        JOIN ksn_function_hall_categories cat ON fc.category_id = cat.category_id
        WHERE cat.category_name = ?
      `, [booking.category]);

      booking.fixed_charges = fixed || [];

      // UTILITY COSTS
      const [utilities] = await db.execute(`
        SELECT uc.utility_name, uc.price_per_hour, uc.default_hours
        FROM ksn_function_hall_utility_costs uc
        JOIN ksn_function_hall_categories cat ON uc.category_id = cat.category_id
        WHERE cat.category_name = ?
      `, [booking.category]);

      booking.utilities = utilities || [];
    }

    // 🔹 SEND RESPONSE
    res.json({
      data: bookings,
      page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    });

  } catch (err) {
    console.error("ERROR in getAllBookingDetails:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
