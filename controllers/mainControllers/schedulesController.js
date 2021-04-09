import express from "express";
const { Router } = express;
import schedules from "../../models/schedule.js";
import checkRole from "../../auth/checkRole.js";
const router = Router();

export async function getSchedules(req, res) {
  try {
    const schedulesList = await schedules.find({});
    res.send({
      schedules: schedulesList,
      count: req.count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getSchedule(req, res) {
  try {
    const schedule = await schedules.findOne({
      _id: req.params.id,
    });
    res.send({
      schedule,
      count: req.count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export async function createSchedule(req, res) {
  try {
    const classroom =
      req.roles.includes("role.superAdmin") && req.body.classroom
        ? req.body.classroom
        : user.classroom._id;
    const schedule = new schedules({
      ...req.body,
      classroom,
      creator: req.user._id,
    });
    await schedule.save();
    return res.send({
      schedule,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function deleteSchedule(req, res) {
  const scheduleToBeDeleted = await schedules.findById(req.params.id);
  try {
    if (!scheduleToBeDeleted)
      return res.status(404).send({
        Error: "No Such Schedule found. It might have been already deleted",
      });

    if (
      !(
        req.user.roles.includes("role.superAdmin") ||
        scheduleToBeDeleted.classroom._id.toString() ==
          req.user.classroom._id.toString()
      )
    ) {
      return res.status(401).send({
        Error: "You cannot delete schedules from other classroom",
      });
    }
    return res.send(await buildings.findByIdAndDelete(req.params.id));
  } catch (error) {
    return res.status(500).send({
      Error: error.toString(),
    });
  }
}
export async function updateSchedule(req, res) {
  try {
    const classroom =
      req.roles.includes("role.superAdmin") && req.body.classroom
        ? req.body.classroom
        : req.user.classroom._id;
    const schedule = {
      ...req.body,
      creator: req.user._id,
      classroom,
    };

    const scheduleToBeUpdated = await schedules.findById(req.params.id);
    if (!scheduleToBeUpdated) {
      return res.status(404).send({
        Error: "No Such Building found. It might have been already deleted",
      });
    }
    if (
      !(
        req.user.roles.includes("role.superAdmin") ||
        scheduleToBeUpdated.college._id.toString() ==
          populatedUser.classroom.college._id.toString()
      )
    ) {
      return res.status(401).send({
        Error: "You cannot update schedule from other classroom",
      });
    }
    return res.send(await schedules.findByIdAndUpdate(req.params.id, schedule));
  } catch (error) {
    return res.status(500).send({
      Error: error.toString(),
    });
  }
}
router.get("/", getSchedules);
router.get("/:id", getSchedule);

router.post("/", checkRole(["role.classAdmin"]), createSchedule);

router.patch("/:id", checkRole(["role.classAdmin"]), updateSchedule);

router.delete("/:id", checkRole(["role.classAdmin"]), deleteSchedule);

export default router;
