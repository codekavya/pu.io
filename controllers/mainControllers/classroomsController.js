import express from "express";
const { Router } = express;
import classrooms from "../../models/classrooms.js";
import checkRole from "../../auth/checkRole.js";
const router = Router();

export async function getClassrooms(req, res) {
  try {
    const classroomList = await classrooms.find({});
    res.send({ faculties: classroomList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getClassroom(req, res) {
  try {
    const faculty = await classrooms.findOne({ _id: req.params.id });
    res.send({ faculty, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function createClassroom(req, res) {
  const classroom = new classrooms(req.body);
  try {
    await classroom.save();
    res.send({ classroom });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function deleteClassroom(req, res) {
  try {
    const classroom = await classrooms.findByIdAndDelete(req.params.id);

    if (!classroom) res.status(404).send("No items Found");
    res.send({ message: "classroom deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function updateClassroom(req, res) {
  try {
    await classrooms.findByIdAndUpdate(req.params.id, req.body);
    const classroom = await classrooms.findOne({ _id: req.params.id });

    res.send({ classroom });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getClassrooms);
router.get("/:id", getClassroom);

router.post("/", checkRole(["role.superAdmin"]), createClassroom);
router.patch("/:id", checkRole(["role.superAdmin"]), updateClassroom);
router.delete("/:id", checkRole(["role.superAdmin"]), deleteClassroom);

export default router;
