import express from "express";
const { Router } = express;
import validAPI from "../auth/validAPI.js";
import auth from "../auth/auth.js";
import { getNotices, getNoticeContent } from "../services/notices.js";
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
router.get("/notices/:category?", async (req, res) => {
  const baseUrl = "https://pu.edu.np/";
  const url = req.params.category
    ? baseUrl + `noticetype/${req.params.category}`
    : baseUrl + "notice";
  console.log(url);
  getNotices(url, (notices) => {
    res.json({
      timeStamp: Date.now(),
      notices: notices,
    });
  });
});

router.post("/notice/", async (req, res) => {
  const { body } = req;
  const { url } = body;
  getNoticeContent(url, (notice) => {
    // console.log(notice);
    res.json({
      timeStamp: Date.now(),
      notice: notice,
    });
  });
});

export default router;
