import schoolsandcolleges from "../models/schoolsandcolleges.js";
const { find } = schoolsandcolleges;
import programs from "../models/programs.js";
import faculties from "../models/faculties.js";
const { find: _find } = faculties;

export async function getPrograms(req, res, next) {
  req.user.requestCount += 1;
  await req.user.save();
  program
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
  find()
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
    const faculty = await _find({});
    const count = (req.user.requestCount += 1);
    await req.user.save();
    res.send({ faculty, count });
  } catch (error) {
    res.status(500).send(error);
  }
}
