import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import db from "../../config/db.js";

export const generatePDFReceipt = async (bookingId) => {
  try {
    // ================= FETCH DATA =================
    const [[booking]] = await db.query(`
      SELECT 
        b.*, 
        c.customer_name, c.phone, c.email, c.address,
        r.referral_name, r.referral_mobileno,
        p.payment_type, p.payment_method, p.paid_amount,
        p.balance_amount, p.transaction_status, p.created_at AS payment_date
      FROM ksn_function_hall_bookings b
      JOIN ksn_function_hall_customer_details c ON c.customer_id = b.customer_id
      LEFT JOIN ksn_function_hall_referrals r ON r.referral_id = b.referral_id
      LEFT JOIN ksn_function_hall_payments p ON p.booking_id = b.booking_id
      WHERE b.booking_id = ?
      ORDER BY p.created_at DESC
      LIMIT 1
    `, [bookingId]);

    if (!booking) return;

    const [fixedCharges] = await db.query(`
      SELECT charges_name, charges_value
      FROM ksn_function_hall_fixed_charges fc
      JOIN ksn_function_hall_categories cat ON fc.category_id = cat.category_id
      WHERE cat.category_name = ?
    `, [booking.category]);

    const [utilities] = await db.query(`
      SELECT utility_name, price_per_hour, default_hours
      FROM ksn_function_hall_utility_costs uc
      JOIN ksn_function_hall_categories cat ON uc.category_id = cat.category_id
      WHERE cat.category_name = ?
    `, [booking.category]);

    const [terms] = await db.query(`
      SELECT terms_text_en
      FROM ksn_function_hall_terms_conditions
      ORDER BY updated_at DESC
      LIMIT 1
    `);

    // ================= PDF SETUP =================
    const receiptsDir = path.join("utility", "receipts");
    if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });

    const filePath = path.join(receiptsDir, `receipt_${bookingId}.pdf`);
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(fs.createWriteStream(filePath));

    doc.font("Helvetica-Bold").fillColor("#1a73e8");

    // ================= HEADER =================
    doc.fontSize(24).text("KSN FUNCTION HALL", { align: "center" });
    doc.fontSize(16).fillColor("#555").text("Payment Receipt", { align: "center" });
    doc.moveDown(1);

    doc.strokeColor("#1a73e8").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // ================= BOOKING SUMMARY =================
    sectionBox(doc, "Booking Summary", () => {
      twoCol(doc, "Booking ID", booking.booking_id);
      twoCol(doc, "Booking Status", booking.booking_status);
      twoCol(doc, "Booking Date", new Date(booking.booking_date).toLocaleDateString("en-IN"));
      if (booking.booking_status.toUpperCase() === "ADVANCE" && booking.balance_due_date) {
        twoCol(doc, "Balance Due Date", new Date(booking.balance_due_date).toLocaleDateString("en-IN"));
      }
    });

    // ================= CUSTOMER DETAILS =================
    sectionBox(doc, "Customer Details", () => {
      twoCol(doc, "Name", booking.customer_name);
      twoCol(doc, "Phone", booking.phone);
      twoCol(doc, "Email", booking.email);
      twoCol(doc, "Address", booking.address);
    });

    // ================= EVENT DETAILS =================
    sectionBox(doc, "Event Details", () => {
      twoCol(doc, "Category", booking.category);
      twoCol(doc, "Hall", booking.hall);
      twoCol(doc, "Event Date", booking.event_date);
      twoCol(doc, "Time Slot", booking.time_slot);
      twoCol(doc, "Duration", `${booking.duration} hrs`);
    });

    // ================= REFERRAL DETAILS =================
    sectionBox(doc, "Referral Details", () => {
      twoCol(doc, "Referral Name", booking.referral_name || "N/A");
      twoCol(doc, "Referral Phone", booking.referral_mobileno || "N/A");
    });

    // ================= FIXED CHARGES =================
    sectionBox(doc, "Fixed Charges", () => {
      fixedCharges.forEach(fc => twoCol(doc, fc.charges_name, `₹ ${fc.charges_value}`));
    });

    // ================= UTILITIES =================
    sectionBox(doc, "Utility Charges", () => {
      utilities.forEach(u => {
        const total = u.price_per_hour * u.default_hours;
        twoCol(doc, `${u.utility_name} (${u.default_hours} hrs)`, `₹ ${total}`);
      });
    });

    // ================= PAYMENT DETAILS =================
    sectionBox(doc, "Payment Details", () => {
      twoCol(doc, "Payment Type", booking.payment_type || "N/A");
      twoCol(doc, "Payment Method", booking.payment_method || "N/A");
      twoCol(doc, "Paid Amount", `₹ ${booking.paid_amount || 0}`);
      twoCol(doc, "Balance Amount", `₹ ${booking.balance_amount || 0}`);
      twoCol(doc, "Transaction Status", booking.transaction_status || "N/A");
      twoCol(doc, "Last Payment Date",
        booking.payment_date ? new Date(booking.payment_date).toLocaleString() : "N/A"
      );
    });

    // ================= TOTAL SUMMARY =================
    sectionBox(doc, "Total Summary", () => {
      const gross = (booking.fixed_charges_total || 0) + (booking.utility_costs_total || 0) + (booking.hall_charge || 0);
      const discount = booking.discount_amount || 0;
      twoCol(doc, "Gross Amount", `₹ ${gross}`);
      twoCol(doc, "Discount", `₹ ${discount}`);
      twoCol(doc, "NET PAYABLE", `₹ ${gross - discount}`);
    });

    // ================= TERMS & CONDITIONS =================
    if (terms.length) {
      sectionBox(doc, "Terms & Conditions", () => {
        doc.fontSize(10).fillColor("#555").text(terms[0].terms_text_en, {
          width: 500,        // ensures text wraps within page margins
          align: "justify",
          lineGap: 3
        });
      });
    }

    // ================= FOOTER =================
    doc.moveDown(2);
    doc.fontSize(10).fillColor("#777").text("Thank you for choosing KSN Function Hall.", { align: "center" });

    doc.end();
    console.log("✅ PDF GENERATED:", filePath);

  } catch (err) {
    console.error("❌ PDF ERROR:", err);
  }
};

// ================= HELPERS =================
const sectionBox = (doc, title, contentCallback) => {
  doc.moveDown(1);
  doc.fontSize(13).fillColor("#1a73e8").text(title);
  doc.moveDown(0.3);
  doc.strokeColor("#1a73e8").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  doc.fontSize(11).fillColor("#000");
  contentCallback();
  doc.moveDown(1);
};

const twoCol = (doc, label, value) => {
  doc.text(label, 50, doc.y, { continued: true });
  doc.text(String(value), 300);
};
