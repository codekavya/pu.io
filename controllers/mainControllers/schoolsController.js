import express from "express";
const { Router } = express;
import schools from "../../models/schoolsandcolleges.js";
import checkRole from "../../auth/checkRole.js";
import { USER_ROLES } from "../../Utils/constants.js";

const router = Router();

export async function getschools(req, res) {
  try {
    const schoolsList = await schools
      .find()
      .select(["name", "classes"])
      .populate({ path: "classes", select: ["name", "shortCode"] });
    return res.send({ schools: schoolsList, count: req.count });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function getAllSchools(req, res) {
  try {
    const schoolsList = await schools.find();
    return res.send({ schools: schoolsList, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getschool(req, res) {
  try {
    const school = await schools.findOne({ _id: req.params.id });
    res.send({ school, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export async function createSchool(req, res) {
  const school = new schools(req.body);
  try {
    await school.save();
    return res.send({ school });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function deleteSchool(req, res) {
  try {
    const school = await schools.findByIdAndDelete(req.params.id);

    if (!school) return res.status(404).send({ Error: "No items Found" });
    res.send({ message: "School deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updateSchool(req, res) {
  try {
    await schools.findByIdAndUpdate(req.params.id, req.body);
    const school = await schools.findOne({ _id: req.params.id });

    res.send({ school });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
router.get("/", getAllSchools);
router.get("/:id", getschool);

router.post("/", checkRole([USER_ROLES.SUPER_ADMIN]), createSchool);
router.patch("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), updateSchool);
router.delete("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), deleteSchool);

export default router;
