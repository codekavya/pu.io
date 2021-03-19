import express from "express";
const { Router } = express;
import auth from "../auth/auth.js";
import facultiesController from "../controllers/mainControllers/facultiesController.js";
import schoolsController from "../controllers/mainControllers/schoolsController.js";
import buildingsController from "../controllers/mainControllers/buildingsController.js";
import clubsController from "../controllers/mainControllers/clubsController.js";
import contactsController from "../controllers/mainControllers/contactsController.js";
import schedulesController from "../controllers/mainControllers/schedulesController.js";
// import noticesController from "../controllers/mainControllers/noticesController.js";
import programsController from "../controllers/mainControllers/programsController.js";
import syllabusController from "../controllers/mainControllers/syllabusController.js";

import {
  noticeController,
  categoryController,
} from "../controllers/mainController.js";

const router = Router();

router.use("/faculties", auth, facultiesController);
router.use("/schoolsandcolleges", auth, schoolsController);
router.use("/programs", auth, programsController);
router.use("/buildings", auth, buildingsController);
router.use("/clubs", auth, clubsController);
router.use("/syllabus", auth, syllabusController);
router.use("/schedules", auth, schedulesController);
router.use("/contacts", auth, contactsController);

router.get("/notices/:category?", auth, categoryController);
router.post("/notice", auth, noticeController);

export default router;
