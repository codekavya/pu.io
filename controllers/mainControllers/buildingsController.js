import express from "express";
const { Router } = express;
import buildings from "../../models/buildings.js";

const router = Router();

export async function getBuildings(req, res) {
  try {
    const facultyList = await buildings.find({});
    res.send({ faculties: facultyList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getBuilding(req, res) {
  try {
    const faculty = await buildings.findOne({ _id: req.params.id });
    res.send({ faculty, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getBuildings);
router.get("/:id", getBuilding);

export default router;
