import express from "express";
const { Router } = express;
import faculties from "../../models/faculties.js";
import checkRole from "../../auth/checkRole.js";
const router = Router();

export async function getFaculties(req, res) {
  try {
    const facultyList = await faculties.find({});
    res.send({ faculties: facultyList, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getFaculty(req, res) {
  try {
    const faculty = await faculties.findOne({ _id: req.params.id });
    res.send({ faculty, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export async function createFaculty(req, res) {
  const faculty = new faculties(req.body);
  try {
    await faculty.save();
    res.send({ faculty });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function deleteFaculty(req, res) {
  try {
    const faculty = await faculties.findByIdAndDelete(req.params.id);

    if (!faculty) return res.status(404).send({ Error: "No items Found" });
    res.send({ message: "Faculty deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updateFaculty(req, res) {
  try {
    await faculties.findByIdAndUpdate(req.params.id, req.body);
    const faculty = await faculties.findOne({ _id: req.params.id });

    res.send({ faculty });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
router.get("/", getFaculties);
router.get("/:id", getFaculty);

router.post("/", createFaculty);
router.patch("/:id", checkRole(["role.superAdmin"]), updateFaculty);
router.delete("/:id", checkRole(["role.superAdmin"]), deleteFaculty);

export default router;
