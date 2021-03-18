import express from "express";
const { Router } = express;
import auth from "../auth/auth.js";

import {
  getFaculties,
  getSchoolsandcolleges,
  getPrograms,
  noticeController,
  categoryController,
  getBuildings,
  getContacts,
  getClubs,
  getSchedules,
  getSyllabus,
} from "../controllers/mainController.js";

const router = Router();

router.get("/faculties", auth, getFaculties);
router.get("/schoolsandcolleges", auth, getSchoolsandcolleges);
router.get("/programs", auth, getPrograms);
router.get("/buildings", auth, getBuildings);
router.get("/clubs", auth, getClubs);
router.get("/syllabus", auth, getSyllabus);
router.get("/schedule", auth, getSchedules);
router.get("/contacts", auth, getContacts);
router.get("/notices/:category?", auth, categoryController);
router.post("/notice/", auth, noticeController);

export default router;
