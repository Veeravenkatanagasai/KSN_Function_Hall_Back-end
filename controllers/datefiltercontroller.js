import db from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  const { fromDate, toDate } = req.query;

  let condition = "";
  let values = [];

  if (fromDate && toDate) {
    condition = "WHERE event_date BETWEEN ? AND ?";
    values = [fromDate, toDate];
  }

  try {
    const [[bookingRow]] = await db.query(
      `SELECT COUNT(*) AS total FROM ksn_function_hall_bookings ${condition}`,
      values
    );


    res.json({
      bookings: bookingRow.total,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};
