import express from "express";
const { Router } = express;
import classroomNotices from "../../models/classroomNotices.js";
import classrooms from "../../models/classrooms.js";
import checkRole from "../../auth/checkRole.js";
import { USER_ROLES } from "../../Utils/constants.js";

const router = Router();

export async function getClassroomNotices(req, res) {
  const query = {};
  const paginateOptions = {
    page: 1,
    limit: 20,
    customLabels: {
      docs: "classroomNotices",
    },
  };
  req.query.page && (paginateOptions.page = req.query.page);
  req.query.limit && (paginateOptions.limit = req.query.limit);
  req.query.type && (query["type"] = req.query.type);
  if (req.query.s) {
    query["$or"] = [
      { title: { $regex: new RegExp(req.query.s), $options: "i" } },
      { description: { $regex: new RegExp(req.query.s), $options: "i" } },
    ];
  }
  console.log(query);
  try {
    const classroomNoticeList = await classroomNotices.paginate(
      query,
      paginateOptions
    );
    res.send({ ...classroomNoticeList, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
export async function getClassroomNotice(req, res) {
  try {
    const faculty = await classroomNotices.findOne({ _id: req.params.id });
    res.send({ faculty, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function getMyClassroomNotice(req, res) {
  const query = {};
  const paginateOptions = {
    page: 1,
    limit: 20,
    customLabels: {
      docs: "classroomNotices",
    },
  };
  req.query.page && (paginateOptions.page = req.query.page);
  req.query.limit && (paginateOptions.limit = req.query.limit);
  req.query.type && (query["type"] = req.query.type);
  if (req.query.s) {
    query["$or"] = [
      { title: { $regex: new RegExp(req.query.s), $options: "i" } },
      { description: { $regex: new RegExp(req.query.s), $options: "i" } },
    ];
  }
  query["classroom"] = req.user.classroom._id;
  console.log(query);
  try {
    const myClassroomNotices = await classroomNotices.paginate(
      query,
      paginateOptions
    );
    res.send({ ...myClassroomNotices, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
export async function createClassroomNotice(req, res) {
  const user = await req.user.populate("classroom").execPopulate();
  console.log(user);
  const classroom = await classrooms.findById(user.classroom._id);
  const classroomNotice = new classroomNotices({
    ...req.body,
    classroom: classroom._id,
    creator: user._id,
  });
  try {
    await classroomNotice.save();
    classroom.notices.push(classroomNotice);
    await classroom.save();
    res.send({ classroomNotice });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
export async function deleteClassroomNotice(req, res) {
  try {
    const noticeToBeDeleted = await classroomNotices.findOne({
      _id: req.params.id,
    });
    if (!noticeToBeDeleted)
      return res.status(404).send({
        Error: "No Such Notice found. It might have been already deleted",
      });

    if (
      !(
        req.roles.includes(USER_ROLES.SUPER_ADMIN) ||
        noticeToBeDeleted.classroom._id.toString() ===
          req.user.classroom._id.toString()
      )
    ) {
      return res
        .status(401)
        .send({ Error: "You cannot delete notice from other classrooms" });
    }
    const classroomNotice = await classroomNotices.findByIdAndDelete(
      req.params.id
    );

    if (!classroomNotice) return res.status(404).send("No items Found");
    res.send({ message: "classroomNotice deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updateClassroomNotice(req, res) {
  try {
    const noticeToBeUpdated = await classroomNotices
      .findOne({
        _id: req.params.id,
      })
      .populate("classroom");

    if (!noticeToBeUpdated)
      return res.status(404).send({
        Error: "No Such Notice found. It might have been already deleted",
      });

    const user = await req.user.populate("classroom").execPopulate();
    console.log(noticeToBeUpdated.classroom._id, user.classroom._id);
    if (
      !(
        req.roles.includes(USER_ROLES.SUPER_ADMIN) ||
        noticeToBeUpdated.classroom._id.toString() ===
          user.classroom._id.toString()
      )
    ) {
      return res
        .status(401)
        .send({ Error: "You cannot edit notice from other classrooms" });
    }
    await classroomNotices.findByIdAndUpdate(req.params.id, req.body);

    const classroomNoticesList = await classroomNotices.findOne({
      _id: req.params.id,
    });

    res.send({ classroomNoticesList });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
//Check if the Admin is of the same class

router.get("/all", checkRole([USER_ROLES.SUPER_ADMIN]), getClassroomNotices);
router.get("/all/:id", getClassroomNotice);
router.get("/", getMyClassroomNotice);
router.post("/", checkRole([USER_ROLES.CLASS_ADMIN]), createClassroomNotice);
router.patch(
  "/:id",
  checkRole([USER_ROLES.CLASS_ADMIN]),
  updateClassroomNotice
);
router.delete(
  "/:id",
  checkRole([USER_ROLES.CLASS_ADMIN]),
  deleteClassroomNotice
);

export default router;
