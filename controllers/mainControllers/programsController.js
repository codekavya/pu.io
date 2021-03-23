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

export async function createProgram(req, res) {
  const program = new programs(req.body);
  try {
    await program.save();
    res.send({ program });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function deleteProgram(req, res) {
  try {
    const program = await programs.findByIdAndDelete(req.params.id);

    if (!program) res.status(404).send("No items Found");
    res.send({ "message": "Program deleted" });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function updateProgram(req, res) {
  try {
    await programs.findByIdAndUpdate(req.params.id, req.body);
    const program = await programs.findOne({ _id: req.params.id });;

    res.send({ program });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getPrograms);
router.get("/:id", getProgram);

router.post("/", createProgram);
router.patch("/:id", updateProgram);
router.delete("/:id", deleteProgram);

export default router;
