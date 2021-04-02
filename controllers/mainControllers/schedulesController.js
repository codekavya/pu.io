import express from "express";
const { Router } = express;
import schedules from "../../models/schedule.js";
import checkRole from "../../auth/checkRole.js";
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

export async function createSchedule(req, res) {
  try {
    const schedule = new schedules({ ...req.body, creator: req.user._id });
    await schedule.save();
    res.send({ schedule });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function deleteSchedule(req, res) {
  try {
    const schedule = await schedules.findByIdAndDelete(req.params.id);

    if (!schedule) res.status(404).send("No items Found");
    res.send({ message: "Schedule deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function updateSchedule(req, res) {
  try {
    await schedules.findByIdAndUpdate(req.params.id, {
      ...req.body,
      creator: req.user._id,
    });
    const schedule = await schedules.findOne({ _id: req.params.id });

    res.send({ schedule });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getSchedules);
router.get("/:id", getSchedule);

router.post("/", checkRole(["role.classAdmin"]), createSchedule);
router.patch("/:id", checkRole(["role.classAdmin"]), updateSchedule);
router.delete("/:id", checkRole(["role.classAdmin"]), deleteSchedule);

export default router;
