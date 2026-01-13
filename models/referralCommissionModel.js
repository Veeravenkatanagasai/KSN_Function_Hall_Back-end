import db from "../config/db.js";

// Get all referrals with customer and booking info
export const getAllReferrals = async () => {
  const [rows] = await db.query(`
    SELECT 
      r.referral_id,
      r.referral_name,
      r.referral_mobileno,
      r.referral_email,
      r.status AS referral_status,
      c.customer_id,
      c.customer_name,
      c.phone AS customer_phone,
      b.booking_id,
      b.event_date,
      b.time_slot,
      b.category,
      rc.commission_id,
      rc.amount AS paid_amount,
      rc.payment_date
    FROM ksn_function_hall_referrals r
    LEFT JOIN ksn_function_hall_bookings b 
      ON r.referral_id = b.referral_id
    LEFT JOIN ksn_function_hall_customer_details c 
      ON b.customer_id = c.customer_id
    LEFT JOIN ksn_function_hall_referral_commission rc
      ON rc.referral_id = r.referral_id 
     AND rc.booking_id = b.booking_id
    ORDER BY r.referral_id DESC, b.booking_id DESC
  `);
  return rows;
};

// Pay commission and mark referral as Paid
export const payReferral = async ({ referral_id, booking_id, amount }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Insert payment
    await conn.query(
      `INSERT INTO ksn_function_hall_referral_commission
      (referral_id, booking_id, customer_id, amount)
      SELECT ?, ?, customer_id, ? FROM ksn_function_hall_bookings WHERE booking_id=?`,
      [referral_id, booking_id, amount, booking_id]
    );

    // Update referral status
    await conn.query(
      `UPDATE ksn_function_hall_referrals
       SET status='Paid'
       WHERE referral_id=?`,
      [referral_id]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
