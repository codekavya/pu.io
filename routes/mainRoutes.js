import express from "express";
const { Router } = express;
import validAPI from "../auth/validAPI.js";
import auth from "../auth/auth.js";

import {
  getFaculties,
  getSchoolsandcolleges,
  getPrograms,
} from "../controllers/mainController.js";

const router = Router();

// router.get("/faculties", auth, validAPI, getFaculties);
router.get("/faculties", getFaculties);
// router.get("/schoolsandcolleges", auth, validAPI, getSchoolsandcolleges);
router.get("/schoolsandcolleges", getSchoolsandcolleges);

// router.get("/programs", auth, validAPI, getPrograms);
router.get("/programs", getPrograms);

export default router;
