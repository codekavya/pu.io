import schoolsandcolleges from "../models/schoolsandcolleges.js";
import programs from "../models/programs.js";
import faculties from "../models/faculties.js";
import syllabus from "../models/syllabus.js";
import clubsinfo from "../models/clubsinfo.js";
import schedule from "../models/schedule.js";
import building from "../models/buildings.js";
import contact from "../models/contacts.js";
import apiCounts from "../models/apiModels.js";
import { getNotices, getNoticeContent } from "../Services/notices.js";

export async function getPrograms(req, res, next) {
  try {
    const programList = await programs.find({});
    res.send({ programList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getSchoolsandcolleges(req, res, next) {
  try {
    const schoolsandcollege = await schoolsandcolleges.find({});
    res.send({ schoolsandcollege, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getFaculties(req, res, next) {
  try {
    const faculty = await faculties.find({});
    res.send({ faculty, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getContacts(req, res, next) {
  try {
    const contacts = await contact.find({});
    res.send({ contacts, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getClubs(req, res, next) {
  try {
    const clubs = await clubsinfo.find({});
    res.send({ clubs, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getSyllabus(req, res, next) {
  try {
    const sylllabuses = await syllabus.find({});
    res.send({ sylllabuses, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getSchedules(req, res, next) {
  try {
    const schedules = await schedule.find({});
    res.send({ schedules, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getBuildings(req, res, next) {
  try {
    const buildings = await building.find({});
    res.send({ buildings, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function noticeController(req, res) {
  const { body } = req;
  const { url } = body;
  await req.user.save();
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
  const url = req.params.category
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
