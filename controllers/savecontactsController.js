import * as Contact from "../models/savecontactsModel.js";

export const listContacts = async (req, res) => {
  try {
    const contacts = await Contact.getAllContacts();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addContact = async (req, res) => {
  try {
    await Contact.createContact(req.body);
    res.json({ message: "Contact saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editContact = async (req, res) => {
  try {
    await Contact.updateContact(req.params.id, req.body);
    res.json({ message: "Contact updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeContact = async (req, res) => {
  try {
    await Contact.deleteContact(req.params.id);
    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
