import express from "express";
const { Router } = express;
import syllabuses from "../../models/syllabus.js";

const router = Router();

export async function getSyllabuses(req, res) {
  try {
    const syllabusesList = await syllabuses.find({});
    res.send({ syllabuses: syllabusesList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getSyllabus(req, res) {
  try {
    const syllabus = await syllabuses.findOne({ _id: req.params.id });
    res.send({ syllabus, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getSyllabuses);
router.get("/:id", getSyllabus);

export default router;
