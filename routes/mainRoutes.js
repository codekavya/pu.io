const express = require("express");
const validAPI = require("../auth/validAPI")

const mainController = require("../controllers/mainController");

const router = express.Router();

router.get("/faculties", validAPI,mainController.getFaculties);
router.get("/schoolsandcolleges",validAPI, mainController.getSchoolsandcolleges);
router.get("/programs", validAPI,mainController.getPrograms);


module.exports = router;
