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

export async function getSchoolsandcolleges(req, res, next) {
  try {
    const schoolsandcollege = await schoolsandcolleges.find({});
    let count = null;
    console.log(req.api);
    if (req.user.apiKey && req.api) {
      const api = await apiCounts.findOne({ Apikey: req.user.apikey });
      // console.log({ api });
      api.TodayHits = api.TodayHits + 1;
      api.TotalHits = api.TotalHits + 1;
      api.save();
      count = api.TodayHits;
    }
    await req.user.save();
    res.send({ schoolsandcollege, count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getFaculties(req, res, next) {
  try {
    const faculty = await faculties.find({});
    let count = null;
    if (req.user.apiKey && req.api) {
      const api = await apiCounts.findOne({ Apikey: req.user.apikey });
      console.log({ api });
      api.TodayHits = api.TodayHits + 1;
      api.TotalHits = api.TotalHits + 1;
      api.save();
      count = api.TodayHits;
    }
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
    let count = null;
    if (req.user.apiKey && req.api) {
      const api = await apiCounts.findOne({ Apikey: req.user.apikey });
      console.log({ api });
      api.TodayHits = api.TodayHits + 1;
      api.TotalHits = api.TotalHits + 1;
      api.save();
      count = api.TodayHits;
    }
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
    let count = null;
    if (req.user.apiKey && req.api) {
      const api = await apiCounts.findOne({ Apikey: req.user.apikey });
      console.log({ api });
      api.TodayHits = api.TodayHits + 1;
      api.TotalHits = api.TotalHits + 1;
      api.save();
      count = api.TodayHits;
    }
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
    let count = null;
    if (req.user.apiKey && req.api) {
      const api = await apiCounts.findOne({ Apikey: req.user.apikey });
      console.log({ api });
      api.TodayHits = api.TodayHits + 1;
      api.TotalHits = api.TotalHits + 1;
      api.save();
      count = api.TodayHits;
    }
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
    let count = null;
    if (req.user.apiKey && req.api) {
      const api = await apiCounts.findOne({ Apikey: req.user.apikey });
      api.TodayHits = api.TodayHits + 1;
      api.TotalHits = api.TotalHits + 1;
      api.save();
      count = api.TodayHits;
    }
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
    let count = null;
    if (req.user.apiKey && req.api) {
      const api = await apiCounts.findOne({ Apikey: req.user.apikey });
      console.log({ api });
      api.TodayHits = api.TodayHits + 1;
      api.TotalHits = api.TotalHits + 1;
      api.save();
      count = api.TodayHits;
    }
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
  let count = null;
  if (req.user.apiKey && req.api) {
    const api = await apiCounts.findOne({ Apikey: req.user.apikey });
    console.log({ api });
    api.TodayHits = api.TodayHits + 1;
    api.TotalHits = api.TotalHits + 1;
    api.save();
    count = api.TodayHits;
  }
  await req.user.save();
  getNoticeContent(url, (notice) => {
    // console.log(notice);
    res.json({
      timeStamp: Date.now(),
      notice: notice,
      count,
    });
  });
}

export async function categoryController(req, res) {
  const baseUrl = "https://pu.edu.np/";
  const url = req.params.category
    ? baseUrl + `noticetype/${req.params.category}`
    : baseUrl + "notice";
  console.log(url);
  let count = null;
  if (req.user.apiKey && req.api) {
    const api = await apiCounts.findOne({ Apikey: req.user.apikey });
    console.log({ api });
    api.TodayHits = api.TodayHits + 1;
    api.TotalHits = api.TotalHits + 1;
    api.save();
    count = api.TodayHits;
  }
  await req.user.save();
  getNotices(url, (notices) => {
    res.json({
      timeStamp: Date.now(),
      notices: notices,
      count,
    });
  });
}
