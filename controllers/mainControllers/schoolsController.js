import express from "express";
const { Router } = express;
import schools from "../../models/schoolsandcolleges.js";

const router = Router();

export async function getschools(req, res) {
  try {
    const schoolsList = await schools.find({});
    res.send({ schools: schoolsList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getschool(req, res) {
  try {
    const school = await schools.findOne({ _id: req.params.id });
    res.send({ school, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getschools);
router.get("/:id", getschool);

export default router;
