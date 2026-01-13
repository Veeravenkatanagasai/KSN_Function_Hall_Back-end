import db from "../config/db.js";

export const fetchPriceRuleFromDB = async (
  category,
  hall,
  timeSlot,
  date
) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM ksn_function_hall_prices
    WHERE category_name = ?
      AND hall_name = ?
      AND time_slot = ?
      AND ? BETWEEN from_date AND to_date
    LIMIT 1
    `,
    [category, hall, timeSlot, date]
  );

  return rows[0];
};
