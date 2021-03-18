import schoolsandcolleges from "../models/schoolsandcolleges.js";
import programs from "../models/programs.js";
import faculties from "../models/faculties.js";
import syllabus from "../models/syllabus.js";
import clubsinfo from "../models/clubsinfo.js";
import schedule from "../models/schedule.js";
import building from "../models/buildings.js";
import contact from "../models/contacts.js";

import { getNotices, getNoticeContent } from "../Services/notices.js";

export async function getPrograms(req, res, next) {
  req.user.requestCount += 1;
  await req.user.save();
  programs
    .find()
    .then((programs) => {
      res.status(200).json({
        programs: programs,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function getSchoolsandcolleges(req, res, next) {
  schoolsandcolleges
    .find()
    .then((sandc) => {
      res.status(200).json({
        School_and_Colleges: sandc,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export async function getFaculties(req, res, next) {
  try {
    const faculty = await faculties.find({});
    req.user.requestCount = req.user.requestCount
      ? (req.user.requestCount += 1)
      : 1;
    const count = req.user.requestCount;
    await req.user.save();
    res.send({ faculty, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getContacts(req, res, next) {
  try {
    const contacts = await contact.find({});
    req.user.requestCount = req.user.requestCount
      ? (req.user.requestCount += 1)
      : 1;
    const count = req.user.requestCount;
    await req.user.save();
    res.send({ contacts, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getClubs(req, res, next) {
  try {
    const clubs = await clubsinfo.find({});
    req.user.requestCount = req.user.requestCount
      ? (req.user.requestCount += 1)
      : 1;
    const count = req.user.requestCount;
    await req.user.save();
    res.send({ clubs, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getSyllabus(req, res, next) {
  try {
    const sylllabuses = await syllabus.find({});
    req.user.requestCount = req.user.requestCount
      ? (req.user.requestCount += 1)
      : 1;
    const count = req.user.requestCount;
    await req.user.save();
    res.send({ sylllabuses, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getSchedules(req, res, next) {
  try {
    const schedules = await schedule.find({});
    req.user.requestCount = req.user.requestCount
      ? (req.user.requestCount += 1)
      : 1;
    const count = req.user.requestCount;
    await req.user.save();
    res.send({ schedules, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getBuildings(req, res, next) {
  try {
    const buildings = await building.find({});
    req.user.requestCount = req.user.requestCount
      ? (req.user.requestCount += 1)
      : 1;
    const count = req.user.requestCount;
    await req.user.save();
    res.send({ buildings, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function noticeController(req, res) {
  const { body } = req;
  const { url } = body;
  getNoticeContent(url, (notice) => {
    // console.log(notice);
    res.json({
      timeStamp: Date.now(),
      notice: notice,
    });
  });
}

export async function categoryController(req, res) {
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
}
