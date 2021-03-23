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

export async function createFaculty(req, res) {
  const faculty = new faculties(req.body);
  try {
    await faculty.save();
    res.send({ faculty });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function deleteFaculty(req, res) {
  try {
    const faculty = await faculties.findByIdAndDelete(req.params.id);

    if (!faculty) res.status(404).send("No items Found");
    res.send({ "message": "Faculty deleted" });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function updateFaculty(req, res) {
  try {
    await faculties.findByIdAndUpdate(req.params.id, req.body);
    const faculty = await faculties.findOne({ _id: req.params.id });;

    res.send({ faculty });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getFaculties);
router.get("/:id", getFaculty);

router.post("/", createFaculty);
router.patch("/:id", updateFaculty);
router.delete("/:id", deleteFaculty);

export default router;
