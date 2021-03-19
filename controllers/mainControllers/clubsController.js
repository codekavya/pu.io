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
router.get("/", getClubs);
router.get("/:id", getClub);

export default router;
