import db from "../config/db.js";
import {
  insertCustomer,
  insertReferral,
  insertBooking,
} from "../models/bookingModel.js";

export const confirmBooking = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const files = req.files || {};

    const customer = {
      ...req.body,
      aadharCustomer: files.aadharCustomer?.[0]?.filename ?? null,
      aadharBride: files.aadharBride?.[0]?.filename ?? null,
      aadharGroom: files.aadharGroom?.[0]?.filename ?? null,
      weddingCard: files.weddingCard?.[0]?.filename ?? null,
    };

    await conn.beginTransaction();

    const customerId = await insertCustomer(conn, customer);

    let referralId = null;
    if (req.body.referralName) {
      referralId = await insertReferral(conn, {
        name: req.body.referralName,
        phone: req.body.referralPhone,
        email: req.body.referralEmail,
      });
    }

    const bookingId = await insertBooking(conn, {
      customerId,
      referralId,
      booking: JSON.parse(req.body.booking),
      invoice: JSON.parse(req.body.invoice),
    });

    await conn.commit();

    res.json({ success: true, message: "Booking confirmed successfully",
      bookingId
     });
  } catch (err) {
    await conn.rollback();
    console.error("Booking save error:", err);
    res.status(500).json({ message: "Booking failed", error: err.message });
  } finally {
    conn.release();
  }
};
