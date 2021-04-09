import express from "express";
const { Router } = express;
import classrooms from "../../models/classrooms.js";
import checkRole from "../../auth/checkRole.js";
const router = Router();

//TODO:IMPLEMENT AUTH
export async function getClassrooms(req, res) {
  try {
    const classroomList = await classrooms.find({});
    res.send({ faculties: classroomList, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getClassroom(req, res) {
  try {
    const faculty = await classrooms.findOne({ _id: req.params.id });
    res.send({ faculty, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export async function createClassroom(req, res) {
  const classroom = new classrooms(req.body);
  try {
    await classroom.save();
    res.send({ classroom });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function deleteClassroom(req, res) {
  try {
    const classroom = await classrooms.findByIdAndDelete(req.params.id);

    if (!classroom) return res.status(404).send({ Error: "No items Found" });
    res.send({ message: "classroom deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updateClassroom(req, res) {
  try {
    await classrooms.findByIdAndUpdate(req.params.id, req.body);
    const classroom = await classrooms.findOne({ _id: req.params.id });

    return res.status(200).send({ classroom });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
router.get("/", getClassrooms);
router.get("/:id", getClassroom);

router.post("/", checkRole(["role.collegeAdmin"]), createClassroom);
router.patch("/:id", checkRole(["role.collegeAdmin"]), updateClassroom);
router.delete("/:id", checkRole(["role.collegeAdmin"]), deleteClassroom);

export default router;
