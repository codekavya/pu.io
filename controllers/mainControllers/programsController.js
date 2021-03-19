import express from "express";
const { Router } = express;
import programs from "../../models/programs.js";

const router = Router();

export async function getPrograms(req, res) {
  try {
    const programsList = await programs.find({});
    res.send({ programs: programsList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getProgram(req, res) {
  try {
    const program = await programs.findOne({ _id: req.params.id });
    res.send({ program, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getPrograms);
router.get("/:id", getProgram);

export default router;
