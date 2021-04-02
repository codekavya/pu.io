import express from "express";
const { Router } = express;
import { getNotices, getNoticeContent } from "../../Services/notices.js";

const router = Router();
export async function noticeController(req, res) {
  try {
    const { body } = req;
    const { url } = body;
    getNoticeContent(url, (notice) => {
      // console.log(notice);
      return res.json({
        timeStamp: Date.now(),
        notice: notice,
        count: req.count,
      });
    });
  } catch (error) {
    return res.code(400).send({
      Error: "Bad request",
    });
  }
}

export async function categoryController(req, res) {
  try {
    const baseUrl = "https://pu.edu.np/";
    const url =
      req.params.category !== "all" && req.params.category
        ? baseUrl + `noticetype/${req.params.category}`
        : baseUrl + "notice";
    getNotices(url, (notices) => {
      return res.json({
        timeStamp: Date.now(),
        notices: notices,
        count: req.count,
      });
    });
  } catch (error) {
    return res.code(400).send({
      Error: "Bad request",
    });
  }
}
router.post("/", noticeController);
router.get("/", categoryController);
router.get("/:category", categoryController);
export default router;
