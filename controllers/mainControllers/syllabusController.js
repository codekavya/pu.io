import express from "express";
const { Router } = express;
import syllabuses from "../../models/syllabus.js";
import checkRole from "../../auth/checkRole.js";
import { USER_ROLES } from "../../Utils/constants.js";

const router = Router();

export async function getSyllabuses(req, res) {
  try {
    const syllabusesList = await syllabuses.find({});
    res.send({ syllabuses: syllabusesList, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getSyllabus(req, res) {
  try {
    const syllabus = await syllabuses.findOne({ _id: req.params.id });
    res.send({ syllabus, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export async function createSyllabus(req, res) {
  const syllabus = new syllabuses({ ...req.body, creator: req.user._id });
  try {
    await syllabus.save();
    res.send({ syllabus });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function deleteSyllabuses(req, res) {
  try {
    const syllabus = await syllabuses.findByIdAndDelete(req.params.id);

    if (!syllabus) return res.status(404).send({ Error: "No items Found" });
    res.send({ message: "Syllabus deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updateSyllabuses(req, res) {
  try {
    await syllabuses.findByIdAndUpdate(req.params.id, req.body);
    const syllabus = await syllabuses.findOne({ _id: req.params.id });

    res.send({ syllabus });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
router.get("/", getSyllabuses);
router.get("/:id", getSyllabus);

router.post("/", checkRole([USER_ROLES.SUPER_ADMIN]), createSyllabus);
router.patch("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), updateSyllabuses);
router.delete("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), deleteSyllabuses);

export default router;
