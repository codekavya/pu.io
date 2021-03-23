import express from "express";
const { Router } = express;
import classroomNotices from "../../models/classroomNotices.js";
import checkRole from "../../auth/checkRole.js";
const router = Router();

export async function getClassroomNotices(req, res) {
  try {
    const classroomNoticeList = await classroomNotices.find({});
    res.send({ classroomNotices: classroomNoticeList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getClassroomNotice(req, res) {
  try {
    const faculty = await classroomNotices.findOne({ _id: req.params.id });
    res.send({ faculty, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getMyClassroomNotice(req, res) {
  try {
    const myClassroomNotices = await classroomNotices.find({
      classroomId: req.user.classroom,
    });
    res.send({ myClassroomNotices });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function createClassroomNotice(req, res) {
  const classroomNotice = new classroomNotices({
    ...req.body,
    classroomId: req.user.classroom,
  });
  try {
    await classroomNotice.save();
    res.send({ classroomNotice });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function deleteClassroomNotice(req, res) {
  try {
    const classroomNotice = await classroomNotices.findByIdAndDelete(
      req.params.id
    );

    if (!classroomNotice) res.status(404).send("No items Found");
    res.send({ message: "classroomNotice deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function updateClassroomNotice(req, res) {
  try {
    await classroomNotices.findByIdAndUpdate(req.params.id, req.body);
    const classroomNotices = await classroomNotices.findOne({
      _id: req.params.id,
    });

    res.send({ classroomNotice });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/all", checkRole(["role.superAdmin"]), getClassroomNotices);
router.get("/all/:id", checkRole(["role.superAdmin"]), getClassroomNotice);
router.get("/", getMyClassroomNotice);
router.post("/", checkRole(["role.classAdmin"]), createClassroomNotice);
router.patch("/:id", updateClassroomNotice);
router.delete("/:id", deleteClassroomNotice);

export default router;
