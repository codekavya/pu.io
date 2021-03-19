import express from "express";
const { Router } = express;
import faculties from "../../models/faculties.js";

const router = Router();

export async function getFaculties(req, res) {
  try {
    const facultyList = await faculties.find({});
    res.send({ faculties: facultyList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getFaculty(req, res) {
  try {
    const faculty = await faculties.findOne({ _id: req.params.id });
    res.send({ faculty, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getFaculties);
router.get("/:id", getFaculty);

export default router;
