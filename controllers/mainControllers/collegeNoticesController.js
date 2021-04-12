import express from "express";
const { Router } = express;
import collegeNotices from "../../models/collegeNotices.js";
import colleges from "../../models/schoolsandcolleges.js";
import checkRole from "../../auth/checkRole.js";
import { USER_ROLES } from "../../Utils/constants.js";

const router = Router();

export async function getCollegeNotices(req, res) {
  const query = {};
  const paginateOptions = {
    page: 1,
    limit: 20,
    customLabels: {
      docs: "collegeNotices",
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
    const collegeNoticeList = await collegeNotices.paginate(
      query,
      paginateOptions
    );
    res.send({ ...collegeNoticeList, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
export async function getCollegeNotice(req, res) {
  try {
    const faculty = await collegeNotices.findOne({ _id: req.params.id });
    res.send({ faculty, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function getMyCollegeNotice(req, res) {
  const query = {};
  const paginateOptions = {
    page: 1,
    limit: 20,
    customLabels: {
      docs: "collegeNotices",
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
  const fullUser = await req.user.populate("classroom").execPopulate();
  query["college"] = fullUser.classroom.college._id;
  console.log(query);
  try {
    const mycollegeNotices = await collegeNotices.paginate(
      query,
      paginateOptions
    );
    res.send({ ...mycollegeNotices, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
export async function createCollegeNotice(req, res) {
  const user = await req.user.populate("classroom").execPopulate();
  const college = await colleges.findById(user.classroom.college._id);
  console.log(college);
  const collegeNotice = new collegeNotices({
    ...req.body,
    college: college._id,
    creator: user._id,
  });
  try {
    await collegeNotice.save();
    console.log(college.notices);
    college.notices.push(collegeNotice);
    await college.save();
    res.send({ collegeNotice });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
export async function deleteCollegeNotice(req, res) {
  try {
    const noticeToBeDeleted = await collegeNotices.findOne({
      _id: req.params.id,
    });
    if (!noticeToBeDeleted)
      return res.status(404).send({
        Error: "No Such Notice found. It might have been already deleted",
      });
    const fullUser = await req.user.populate("classroom").execPopulate();
    if (
      !(
        req.roles.includes(USER_ROLES.SUPER_ADMIN) ||
        noticeToBeDeleted.college._id.toString() ===
          fullUser.classroom.college._id.toString()
      )
    ) {
      return res
        .status(401)
        .send({ Error: "You cannot delete notice from other colleges" });
    }
    const collegeNotice = await collegeNotices.findByIdAndDelete(req.params.id);

    if (!collegeNotice) return res.status(404).send("No items Found");
    res.send({ message: "collegeNotice deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updateCollegeNotice(req, res) {
  try {
    const noticeToBeUpdated = await collegeNotices.findOne({
      _id: req.params.id,
    });

    if (!noticeToBeUpdated)
      return res.status(404).send({
        Error: "No Such Notice found. It might have been already deleted",
      });
    const fullUser = await req.user.populate("classroom").execPopulate();
    if (
      !(
        req.roles.includes(USER_ROLES.SUPER_ADMIN) ||
        noticeToBeUpdated.college._id.toString() ===
          fullUser.classroom.college._id.toString()
      )
    ) {
      return res
        .status(401)
        .send({ Error: "You cannot edit notice from other colleges" });
    }
    await collegeNotices.findByIdAndUpdate(req.params.id, req.body);

    const collegeNotice = await collegeNotices.findOne({
      _id: req.params.id,
    });

    res.send({ collegeNotice });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

router.get("/all", checkRole([USER_ROLES.SUPER_ADMIN]), getCollegeNotices);
router.get("/all/:id", getCollegeNotice);
router.get("/", getMyCollegeNotice);
router.post("/", checkRole([USER_ROLES.COLLEGE_ADMIN]), createCollegeNotice);
router.patch(
  "/:id",
  checkRole([USER_ROLES.COLLEGE_ADMIN]),
  updateCollegeNotice
);
router.delete(
  "/:id",
  checkRole([USER_ROLES.COLLEGE_ADMIN]),
  deleteCollegeNotice
);

export default router;
