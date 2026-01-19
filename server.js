import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";


//Routes
import "./utility/bookingExpiryCorn.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import timeslotRoutes from "./routes/timeslotRoutes.js";
import hallRoutes from "./routes/hallRoutes.js";
import hallpricingRoutes from "./routes/hallpricingRoutes.js";
import FixedChargesRoutes from "./routes/FixedChargesRoutes.js";
import utilityRoutes from "./routes/utilityCostRoutes.js";
import pricingRuleRoutes from "./routes/pricingRuleRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import showDetailsRoutes from "./routes/showDetailsRoutes.js";
import datefilterRoutes from "./routes/datefilterRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js"; 
import authRoutes from "./routes/employeeauthRoutes.js"; 
import savecontactsRoutes from "./routes/savecontactsRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import vendorRoutes from"./routes/vendorRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import referralCommissionRoutes from "./routes/referralCommissionRoutes.js";
import termsconditionRoutes from "./routes/termsconditionRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cancellationRuleRoutes from "./routes/cancellationRuleRoutes.js";
import cancellaationRoutes from "./routes/cancellationRoutes.js";
import electricityRoutes from "./routes/electricityRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
/* -------- Middleware -------- */
app.use(cors({
  origin: "https://ksn-function-hall.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "employee_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));
app.use(bodyParser.json());
// Serve uploaded files
app.use("/uploads", express.static("uploads"));

/* -------- API Routes -------- */
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/timeslots", timeslotRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/hallpricing", hallpricingRoutes);
app.use("/api/fixedcharges", FixedChargesRoutes);
app.use("/api/utilities", utilityRoutes);
app.use("/api/price-rules", pricingRuleRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/booking-details", showDetailsRoutes);
app.use("/api/datefilter", datefilterRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/savecontacts",savecontactsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/vendors",vendorRoutes);
app.use("/api/services",servicesRoutes);
app.use("/api/referral-commissions",referralCommissionRoutes);
app.use("/api/terms",termsconditionRoutes);
app.use("/api/translate",translateRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/receipts", express.static(path.join("utility", "receipts")));
app.use("/api/cancellation-rules",cancellationRuleRoutes);
app.use("/api/cancellation",cancellaationRoutes);
app.use("/api/electricity",electricityRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
