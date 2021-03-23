import express from "express";
const { Router } = express;
import buildings from "../../models/buildings.js";

const router = Router();

export async function getBuildings(req, res) {
  try {
    const buildingList = await buildings.find({});
    res.send({ faculties: buildingList, count: req.count });
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

export async function createBuilding(req, res) {
  const building = new buildings(req.body);
  try {
    await building.save();
    res.send({ building });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function deleteBuilding(req, res) {
  try {
    const building = await buildings.findByIdAndDelete(req.params.id);

    if (!building) res.status(404).send("No items Found");
    res.send({ message: "Building deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function updateBuilding(req, res) {
  try {
    await buildings.findByIdAndUpdate(req.params.id, req.body);
    const building = await buildings.findOne({ _id: req.params.id });

    res.send({ building });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getBuildings);
router.get("/:id", getBuilding);

router.post("/", createBuilding);
router.patch("/:id", updateBuilding);
router.delete("/:id", deleteBuilding);

export default router;
