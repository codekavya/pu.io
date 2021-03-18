import { Router } from "express";
import validAPI from "../auth/validAPI.js";
import auth from "../auth/auth.js";

import {
  getFaculties,
  getSchoolsandcolleges,
  getPrograms,
} from "../controllers/mainController.js";

const router = Router();

router.get("/faculties", auth, validAPI, getFaculties);
router.get("/schoolsandcolleges", auth, validAPI, getSchoolsandcolleges);
router.get("/programs", auth, validAPI, getPrograms);

export default router;
