const express = require("express");
const auth = require("../auth/auth")

const mainController = require("../controllers/mainController");

const router = express.Router();

router.get("/faculties", auth,mainController.getFaculties);
router.get("/schoolsandcolleges",auth, mainController.getSchoolsandcolleges);
router.get("/programs", auth,mainController.getPrograms);


module.exports = router;
