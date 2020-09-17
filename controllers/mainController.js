const schoolsandcolleges = require("../models/schoolsandcolleges");
const programs = require("../models/programs");
const faculties = require("../models/faculties");


exports.getPrograms = async (req, res, next) => {
  req.user.requestCount+=1;
      await req.user.save();
  program.find()
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

exports.getFaculties = async(req, res, next) => {
  try {
   const faculty =  await faculties.find({ })
   const count = req.user.requestCount+=1;
   await req.user.save();
    res.send({ faculty,count });
  } catch (error) {
    res.status(500).send(error);
  }
};
