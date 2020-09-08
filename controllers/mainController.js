const schoolsandcolleges = require("../models/schoolsandcolleges");
const programs = require("../models/programs");
const faculties = require("../models/faculties");

exports.getPrograms = (req, res, next) => {
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
};

exports.getSchoolsandcolleges = (req, res, next) => {
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
};

exports.getFaculties = (req, res, next) => {
  faculties
    .find()
    .then((faculties) => {
      res.status(200).json({ faculties: faculties });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
