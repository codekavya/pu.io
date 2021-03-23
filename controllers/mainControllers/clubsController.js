import express from "express";
const { Router } = express;
import clubs from "../../models/clubsinfo.js";

const router = Router();

export async function getClubs(req, res) {
  try {
    const clubsList = await clubs.find({});
    res.send({ clubs: clubsList, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function getClub(req, res) {
  try {
    const club = await clubs.findOne({ _id: req.params.id });
    res.send({ club, count: req.count });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function createClub(req, res) {
  const club = new clubs(req.body);
  try {
    await club.save();
    res.send({ club });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function deleteClub(req, res) {
  try {
    const club = await clubs.findByIdAndDelete(req.params.id);

    if (!club) res.status(404).send("No items Found");
    res.send({ "message": "Club deleted" });

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
export async function updateClub(req, res) {
  try {
    await clubs.findByIdAndUpdate(req.params.id, req.body);
    const club = await clubs.findOne({ _id: req.params.id });;

    res.send({ club });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
router.get("/", getClubs);
router.get("/:id", getClub);

router.post("/", createClub);
router.patch("/:id", updateClub);
router.delete("/:id", deleteClub);

export default router;
