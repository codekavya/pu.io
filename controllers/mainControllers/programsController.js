import express from "express";
const { Router } = express;
import programs from "../../models/programs.js";
import checkRole from "../../auth/checkRole.js";
import { USER_ROLES } from "../../Utils/constants.js";
const router = Router();

export async function getPrograms(req, res) {
  try {
    const programsList = await programs.find({});
    return res.send({ programs: programsList, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getProgram(req, res) {
  try {
    const program = await programs.findOne({ _id: req.params.id });
    res.send({ program, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export async function createProgram(req, res) {
  const program = new programs(req.body);
  try {
    await program.save();
    res.send({ program });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function deleteProgram(req, res) {
  try {
    const program = await programs.findByIdAndDelete(req.params.id);

    if (!program) return res.status(404).send("No items Found");
    res.send({ message: "Program deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updateProgram(req, res) {
  try {
    await programs.findByIdAndUpdate(req.params.id, req.body);
    const program = await programs.findOne({ _id: req.params.id });

    return res.send({ program });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
router.get("/", getPrograms);
router.get("/:id", getProgram);

router.post("/", checkRole([USER_ROLES.SUPER_ADMIN]), createProgram);
router.patch("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), updateProgram);
router.delete("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), deleteProgram);

export default router;
