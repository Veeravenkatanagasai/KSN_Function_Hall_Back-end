import express from "express";
import { getTerms, createTerm, editTerm, removeTerm } from "../controllers/termsconditionController.js";

const router = express.Router();

router.get("/", getTerms);
router.post("/", createTerm);
router.put("/", editTerm);
router.delete("/:id", removeTerm);

export default router;
