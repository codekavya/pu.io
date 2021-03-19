import express from "express";
const { Router } = express;
import contacts from "../../models/contacts.js";

const router = Router();

export async function getContacts(req, res) {
  try {
    const contactsList = await contacts.find({});
    res.send({ contacts: contactsList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getContact(req, res) {
  try {
    const contact = await contacts.findOne({ _id: req.params.id });
    res.send({ contact, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getContacts);
router.get("/:id", getContact);

export default router;
