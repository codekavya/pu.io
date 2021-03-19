import express from "express";
const { Router } = express;
import schedules from "../../models/schedule.js";

const router = Router();

export async function getSchedules(req, res) {
  try {
    const schedulesList = await schedules.find({});
    res.send({ schedules: schedulesList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getSchedule(req, res) {
  try {
    const schedule = await schedules.findOne({ _id: req.params.id });
    res.send({ schedule, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getSchedules);
router.get("/:id", getSchedule);

export default router;
