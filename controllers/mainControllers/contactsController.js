import express from "express";
const { Router } = express;
import contacts from "../../models/contacts.js";
import checkRole from "../../auth/checkRole.js";
import colleges from "../../models/schoolsandcolleges.js";
const router = Router();

export async function getContacts(req, res) {
  const query = {};
  const paginateOptions = {
    page: 1,
    limit: 20,
    customLabels: {
      docs: "contacts",
    },
  };
  req.query.page && (paginateOptions.page = req.query.page);
  req.query.limit && (paginateOptions.limit = req.query.limit);
  req.query.college && (query["college"] = req.query.college);
  req.query.type && (query["type"] = req.query.type);
  if (req.query.s) {
    query["$or"] = [
      { name: { $regex: new RegExp(req.query.s), $options: "i" } },
      { description: { $regex: new RegExp(req.query.s), $options: "i" } },
      { type: { $regex: new RegExp(req.query.s), $options: "i" } },
      { email: { $regex: new RegExp(req.query.s), $options: "i" } },
      { number: { $regex: new RegExp(req.query.s), $options: "i" } },
    ];
  }
  try {
    const contactsList = await contacts.paginate(query, paginateOptions);
    res.send({ ...contactsList, count: req.count });
  } catch (error) {
    res.status(500).send(error);
  }
}
export async function getContact(req, res) {
  try {
    const contact = await contacts.
    findOne({ _id: req.params.id }).
    populate({
      path:"college"
    }).execPopulate();

    res.send({ college: contact.college, count: req.count });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function createContactFromForm(req, res) {
  const fullUser = await req.user.populate("classroom").execPopulate();
  const contactCollege = await colleges.findById(
    fullUser.classroom.college._id
  );
  const contact = new contacts({
    ...req.body,
    college: contactCollege._id,
    createdBy: req.user._id,
  });
  try {
    await contact.save();
    contactCollege.contacts.push(contact);
    await contactCollege.save();
    res.send({ contact });
  } catch (error) {
    res.status(500).send(error);
  }
}
export async function createContact(req, res) {
  const contact = new contacts({ ...req.body, createdBy: req.user._id });
  const contactCollege = colleges.findById(req.body.college);
  try {
    await contact.save();
    contactCollege.contacts.push(contact);
    await contactCollege.save();
    res.send({ contact });
  } catch (error) {
    res.status(500).send(error);
  }
}


export async function deleteContact(req, res) {
  try{
    let contact = await contacts.findById(req.params.id);
    if (!( contact.createdBy == req.user._id || req.roles.includes("role.superAdmin") )) {
      return res.status(401).send({
        Error: "You cannot delete this contact",
      });
    }
  }catch(E){
    console.log(E)
    // since contact is null if contact is alraedy deleted
    //so send Response no Contact Found
    return res.status(401).send({
      Error: "No Such Contacts"
    });
  }
  try {
    const contact = await contacts.findByIdAndDelete(req.params.id);

    if (!contact) res.status(404).send("No items Found");
    res.send({ message: "contact deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
}
export async function updateContact(req, res) {
  let contact = await contacts.findOne({ _id: req.params.id });
  if (
    !(
      contact.createdBy._id == req.user._id ||
      req.roles.includes("role.superAdmin")
    )
  ) {
    return res.status(401).send({
      Error: "You cannot update this contact",
    });
  }
  let college;
  if (req.roles.includes("role.superAdmin")) {
    college = req.body.college;
  } else {
    const reqUser = await req.user.populate("classroom").execPopulate();
    college = reqUser.classroom.college._id;
  }
  try {
    await contacts.findByIdAndUpdate(req.params.id, {
      ...req.body,
      createdBy: req.user._id,
      college,
    });
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
router.patch("/:id", checkRole(["role.collegeAdmin"]), updateContact);
router.delete("/:id",checkRole(["role.superAdmin", "role.collegeAdmin"]),deleteContact);

export default router;
