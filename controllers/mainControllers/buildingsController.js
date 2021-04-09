import express from "express";
import buildings from "../../models/buildings.js";
import checkRole from "../../auth/checkRole.js";
import { USER_ROLES } from "../../Utils/constants.js";

const { Router } = express;
const router = Router();

export async function getBuildings(req, res) {
  try {
    const buildingList = await buildings.find({});
    res.send({
      building: buildingList,
      count: req.count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getBuilding(req, res) {
  try {
    const building = await buildings.findOne({
      _id: req.params.id,
    });
    res.send({
      building,
      count: req.count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

//Ask User for their college and class during form signup

export async function createBuilding(req, res) {
  const user = await req.user.populate("classroom").execPopulate();

  const college =
    req.roles.includes(USER_ROLES.SUPER_ADMIN) && req.body.college
      ? req.body.college
      : user.classroom.college._id;

  const building = new buildings({
    ...req.body,
    creator: req.user._id,
    college: college,
  });
  try {
    await building.save();
    res.send({
      building,
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
}
export async function deleteBuilding(req, res) {
  try {
    const populatedUser = await req.user
      .populate({
        path: "classroom",
        select: "college",
      })
      .execPopulate();

    const buildingToBeDeleted = await buildings.findById(req.params.id);

    if (!buildingToBeDeleted)
      return res.status(404).send({
        Error: "No Such Building found. It might have been already deleted",
      });
    if (
      !(
        req.user.roles.includes(USER_ROLES.SUPER_ADMIN) ||
        buildingToBeDeleted.college._id.toString() ==
          populatedUser.classroom.college._id.toString()
      )
    ) {
      return res.status(401).send({
        Error: "You cannot delete building from other college",
      });
    }
    return res.send(await buildings.findByIdAndDelete(req.params.id));
  } catch (error) {
    return res.status(500).send({
      Error: error.toString(),
    });
  }
}
export async function updateBuilding(req, res) {
  try {
    const populatedUser = await req.user
      .populate({
        path: "classroom",
        select: "college",
      })
      .execPopulate();

    const college =
      req.roles.includes(USER_ROLES.SUPER_ADMIN) && req.body.college
        ? req.body.college
        : req.user.classroom.college._id;

    const building = {
      ...req.body,
      creator: req.user._id,
      college: college,
    };

    const buildingToBeUpdated = await buildings.findById(req.params.id);

    if (!buildingToBeUpdated)
      return res.status(404).send({
        Error: "No Such Building found. It might have been already deleted",
      });
    if (
      !(
        req.user.roles.includes(USER_ROLES.SUPER_ADMIN) ||
        buildingToBeUpdated.college._id.toString() ==
          populatedUser.classroom.college._id.toString()
      )
    ) {
      return res.status(401).send({
        Error: "You cannot update building from other college",
      });
    }
    return res.send(await buildings.findByIdAndUpdate(req.params.id, building));
  } catch (error) {
    return res.status(500).send({
      Error: error.toString(),
    });
  }
}
router.get("/", getBuildings);
router.get("/:id", getBuilding);

router.post("/", checkRole([USER_ROLES.COLLEGE_ADMIN]), createBuilding);
router.patch("/:id", checkRole([USER_ROLES.COLLEGE_ADMIN]), updateBuilding);
router.delete("/:id", checkRole([USER_ROLES.COLLEGE_ADMIN]), deleteBuilding);

export default router;
