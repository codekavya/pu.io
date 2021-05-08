import express from "express";
import path from 'path';
import checkMember from "../Utils/check_member.js"

const {
    Router
} = express;

import auth from "../auth/auth.js";

import {
    createRoom,
    sendMessage
} from "../controllers/chatsController.js"
const router = Router();


router.post("/room/create", auth(), createRoom);

//get all the rooms of the user
router.get('/allrooms', auth(), async(req, res, next) => {
    //populate the loggedin user's chatRoom field and send the chatRoom object as response
    const loggedinUser = await req.user.
    populate({
        path: "chatRooms",
        select: ["Name", "id"]
    }).execPopulate()
    res.send({ rooms: loggedinUser })
})

//GET REQUEST TO .../rooms/?id=xyz 
router.get("/room", auth(), checkMember, async(req, res, next) => {
    try {
        res.sendFile(path.join(process.cwd(), "public", "chatbox.html"));
        next();
    } catch (E) {
        console.log(E)
        res.send({ Error: E })
    }

}, sendMessage)
export default router;