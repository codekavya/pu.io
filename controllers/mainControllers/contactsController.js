import express from "express";
const { Router } = express;
import contacts from "../../models/contacts.js";
import checkRole from "../../auth/checkRole.js";

const router = Router();

export async function getContacts(req, res) {
  try {
    const contactsList = await contacts.find({});
    res.send({ contacts: contactsList, count: req.count });
  } catch (error) {
    res.status(500).send(error);
  }
}
export async function getContact(req, res) {
  try {
    const contact = await contacts.findOne({ _id: req.params.id });
    res.send({ contact, count: req.count });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function createContactFromForm(req, res) {
  const contact = new contacts({ ...req.body, college: req.user.college });
  try {
    await contact.save();
    res.send({ contact });
  } catch (error) {
    res.status(500).send(error);
  }
}
export async function createContact(req, res) {
  const contact = new contacts(req.body);
  try {
    await contact.save();
    res.send({ contact });
  } catch (error) {
    res.status(500).send(error);
  }
}
export async function deleteContact(req, res) {
  try {
    const contact = await contacts.findByIdAndDelete(req.params.id);

    if (!contact) res.status(404).send("No items Found");
    res.send({ message: "contact deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
}
export async function updateContact(req, res) {
  try {
    await contacts.findByIdAndUpdate(req.params.id, req.body);
    const contact = await contacts.findOne({ _id: req.params.id });

    res.send({ contact });
  } catch (error) {
    res.status(500).send(error);
  }
}
router.get("/", getContacts);
router.get("/:id", getContact);

router.post("/", checkRole(["role.superAdmin"]), createContact);
router.post(
  "/createnew",
  checkRole(["role.collegeAdmin"]),
  createContactFromForm
);
router.patch("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
