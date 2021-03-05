const express = require("express");
const validAPI = require("../auth/validAPI")
const auth = require('../auth/auth')

const mainController = require("../controllers/mainController");

const router = express.Router();

router.get("/faculties", auth,validAPI,mainController.getFaculties);
router.get("/schoolsandcolleges",auth,validAPI,mainController.getSchoolsandcolleges);
router.get("/programs", auth,validAPI,mainController.getPrograms);


module.exports = router;
