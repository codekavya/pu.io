import express from "express";
const { Router } = express;

import auth from "../auth/auth.js";
import checkRole from "../auth/checkRole.js";

import facultiesController from "../controllers/mainControllers/facultiesController.js";
import schoolsController, {
  getschools,
} from "../controllers/mainControllers/schoolsController.js";
import buildingsController from "../controllers/mainControllers/buildingsController.js";
import clubsController from "../controllers/mainControllers/clubsController.js";
import contactsController from "../controllers/mainControllers/contactsController.js";
import schedulesController from "../controllers/mainControllers/schedulesController.js";
import noticesController from "../controllers/mainControllers/noticesController.js";
import programsController from "../controllers/mainControllers/programsController.js";
import syllabusController from "../controllers/mainControllers/syllabusController.js";
import classroomNoticesController from "../controllers/mainControllers/classroomNoticesController.js";
import classroomCotroller from "../controllers/mainControllers/classroomsController.js";
const router = Router();

router.use("/faculties", auth(), facultiesController);
router.use("/schoolsandcolleges", auth(), checkRole([]), schoolsController);
router.use("/programs", auth(), programsController);
router.use("/buildings", auth(), buildingsController);
router.use("/clubs", auth(), clubsController);
router.use("/syllabus", auth(), syllabusController);
router.use("/schedules", auth(), schedulesController);
router.use("/contacts", auth(), contactsController);
router.use("/notices", auth(), noticesController);
router.use("/classroom", auth(), classroomCotroller);
router.use("/classroomNotices", auth(), classroomNoticesController);
router.get("/colleges/list", getschools);
router.get("/check", auth(), checkRole(["role.classadmin"]), (req, res) =>
  res.send("Hehe noice program")
);
export default router;
