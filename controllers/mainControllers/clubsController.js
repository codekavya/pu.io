import express from "express";
const { Router } = express;
import clubs from "../../models/clubsinfo.js";
import checkRole from "../../auth/checkRole.js";
const router = Router();
import users from "../../models/adminModels.js";
import { USER_ROLES } from "../../Utils/constants.js";

//TODO:Auth needed to be implemented
export async function getClubs(req, res) {
  try {
    const clubsList = await clubs.find({});
    res.send({ clubs: clubsList, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function getClub(req, res) {
  try {
    const club = await clubs.findOne({ _id: req.params.id });
    res.send({ club, count: req.count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}

export async function createClub(req, res) {
  try {
    let committeeMembers = [];
    const members = await req.body.committee.map(async (element) => {
      const member = await users.findOne({ Username: element.member });
      if (!member) {
        throw new Error(`${element.member} doesn't exit.`);
      }
      if (element.canPostEvent === true) {
        member.roles.push(USER_ROLES.CLUB_MANAGER);
      }
      committeeMembers.push(member);
      return { ...element, member: member._id };
    });
    const committee = [...(await Promise.all(members))];
    const club = await new clubs({
      ...req.body,
      committee,
    });
    try {
      await club.save();
      committeeMembers.forEach((member) => {
        member.clubs.push(club._id);
        member.save();
      });
      return res.send({ club });
    } catch (error) {
      return res.status(500).send({ Error: error });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).send({ Error: err.message.toString() });
  }
}
export async function deleteClub(req, res) {
  try {
    const club = await clubs.findByIdAndDelete(req.params.id);

    if (!club) return res.status(404).send("No items Found");
    res.send({ message: "Club deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
export async function updateClub(req, res) {
  try {
    await clubs.findByIdAndUpdate(req.params.id, req.body);
    const club = await clubs.findOne({ _id: req.params.id });

    res.send({ club });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Error: error });
  }
}
router.get("/", getClubs);
router.get("/:id", getClub);

router.post("/", createClub);
router.patch("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), updateClub);
router.delete("/:id", checkRole([USER_ROLES.SUPER_ADMIN]), deleteClub);

export default router;
