const express = require("express");

const mainController = require("../controllers/mainController");

const router = express.Router();

router.get("/faculties", mainController.getFaculties);
router.get("/schoolsandcolleges", mainController.getSchoolsandcolleges);
router.get("/programs", mainController.getPrograms);

module.exports = router;
