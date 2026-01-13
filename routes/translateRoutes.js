import express from "express";
import { translate } from "../controllers/translateController.js";

const router = express.Router();

router.get("/", translate);

export default router;
