import express from "express";
import {
  listContacts,
  addContact,
  editContact,
  removeContact
} from "../controllers/savecontactsController.js";

const router = express.Router();

router.get("/", listContacts);
router.post("/", addContact);
router.put("/:id", editContact);
router.delete("/:id", removeContact);

export default router;
