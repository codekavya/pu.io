import express from "express";
const { Router } = express;
import { getNotices, getNoticeContent } from "../../Services/notices.js";

const router = Router();
export async function noticeController(req, res) {
  const { body } = req;
  const { url } = body;
  getNoticeContent(url, (notice) => {
    // console.log(notice);
    res.json({
      timeStamp: Date.now(),
      notice: notice,
      count: req.count,
    });
  });
}

export async function categoryController(req, res) {
  const baseUrl = "https://pu.edu.np/";
  const url =
    req.params.category !== "all" && req.params.category
      ? baseUrl + `noticetype/${req.params.category}`
      : baseUrl + "notice";
  console.log(url);
  getNotices(url, (notices) => {
    res.json({
      timeStamp: Date.now(),
      notices: notices,
      count: req.count,
    });
  });
}
router.post("/", noticeController);
router.get("/", categoryController);
router.get("/:category", categoryController);
export default router;
