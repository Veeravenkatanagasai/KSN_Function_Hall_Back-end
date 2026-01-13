import cron from "node-cron";
import db from "../config/db.js";

cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running auto-cancel job");

  const today = new Date().toISOString().split("T")[0];

  const [rows] = await db.query(
    `
    SELECT booking_id
    FROM ksn_function_hall_bookings
    WHERE booking_status = 'ADVANCE'
      AND balance_due_date < ?
      AND balance_amount > 0
    `,
    [today]
  );

  for (const row of rows) {
    await db.query(
      `UPDATE ksn_function_hall_bookings
       SET booking_status = 'CANCELLED'
       WHERE booking_id = ?`,
      [row.booking_id]
    );

    console.log(`❌ Auto-cancelled booking ${row.booking_id}`);
  }
});
