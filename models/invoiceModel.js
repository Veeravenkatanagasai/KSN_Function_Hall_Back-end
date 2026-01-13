import db from "../config/db.js";

export const getPriceRuleForInvoice = async ({
  category,
  hall,
  timeSlot,
  eventDate,
}) => {
  const [rows] = await db.query(
    `
    SELECT 
      base_price_per_hour,
      advance_percent
    FROM ksn_function_hall_prices
    WHERE category_name = ?
      AND hall_name = ?
      AND time_slot = ?
      AND ? BETWEEN from_date AND to_date
    `,
    [category, hall, timeSlot, eventDate]
  );

  if (!rows.length) return null;

  const rule = rows[0];

  // category id
  const [[cat]] = await db.query(
    "SELECT category_id FROM ksn_function_hall_categories WHERE category_name = ?",
    [category]
  );

  // fixed charges
  const [fixedCharges] = await db.query(
    "SELECT charges_name, charges_value FROM ksn_function_hall_fixed_charges WHERE category_id = ?",
    [cat.category_id]
  );

  // utilities
  const [utilities] = await db.query(
    "SELECT utility_name, price_per_hour, default_hours FROM ksn_function_hall_utility_costs WHERE category_id = ?",
    [cat.category_id]
  );

  return {
    ...rule,
    fixedCharges,
    utilities,
  };
};
