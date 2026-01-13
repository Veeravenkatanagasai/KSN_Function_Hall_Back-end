import db from "../config/db.js";
// ---------- CUSTOMER ----------
export const insertCustomer = async (conn, data) => {
  const sql = `
    INSERT INTO ksn_function_hall_customer_details
    (customer_name, phone, alternate_phone, email, address,
     aadhar_customer_path, aadhar_bride_path, aadhar_groom_path, wedding_card_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await conn.execute(sql, [
    data.name ?? null,
    data.phone ?? null,
    data.alternatePhone ?? null,
    data.email ?? null,
    data.address ?? null,
    data.aadharCustomer ?? null,
    data.aadharBride ?? null,
    data.aadharGroom ?? null,
    data.weddingCard ?? null,
  ]);

  return result.insertId;
};

// ---------- REFERRAL ----------
export const insertReferral = async (conn, data) => {
  const sql = `
    INSERT INTO ksn_function_hall_referrals
    (referral_name, referral_mobileno, referral_email)
    VALUES (?, ?, ?)
  `;

  const [result] = await conn.execute(sql, [
    data.name ?? null,
    data.phone ?? null,
    data.email ?? null,
  ]);

  return result.insertId;
};

// ---------- BOOKING ----------
export const insertBooking = async (conn, payload) => {
  const { customerId, referralId, booking, invoice } = payload;

  const sql = `
    INSERT INTO ksn_function_hall_bookings (
  customer_id,
  referral_id,
  category,
  hall,
  time_slot,
  event_date,
  start_time,
  end_time,
  duration,
  discount_percent,
  gross_total_before_discount,
  fixed_charges_total,
  discount_amount,
  hall_charge,
  booking_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await conn.execute(sql, [
  customerId,
  referralId ?? null,

  booking.category ?? null,
  booking.hall ?? null,
  booking.timeSlot ?? null,
  booking.eventDate ?? null,
  booking.startTime ?? null,
  booking.endTime ?? null,

  invoice.hours ?? 0,
  booking.discount ?? 0,

  invoice.grossTotal ?? invoice.grandTotal ?? 0,
  invoice.fixedChargeAmount ?? 0,
  invoice.discountAmount ?? 0,
  invoice.hallCharge ?? invoice.baseAmount ?? 0,
  booking.bookingStatus ?? 'Booking'
]
);
  return result.insertId;
};


export const getBookingById = async (bookingId) => {
    const [booking] = await db.query(
        `SELECT * FROM ksn_function_hall_bookings WHERE booking_id = ?`,
        [bookingId]
    );
    return booking[0];
};

export const updateBookingStatus = async (bookingId, status) => {
    await db.query(
        `UPDATE ksn_function_hall_bookings SET booking_status = ? WHERE booking_id = ?`,
        [status, bookingId]
    );
};

