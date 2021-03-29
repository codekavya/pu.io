import express from "express";
import { io } from "../app.js";
import path from 'path';

const {
    Router
} = express;

import auth from "../auth/auth.js";

import {
    createRoom, sendMessage
} from "../controllers/chatsController.js"
const router = Router();


router.post("/create",auth(),createRoom);
router.get('/rooms',auth(),async(req,res,next)=>{
    const user = req.user.populate({
        path:"chatRoom",
        populate:{
            path:"Users"
        }
    })
    res.send({rooms: user.chatRooms})
})

//append the id when user clicks in the room
//array of rooms object id is sent to fromtend
router.get("/rooms/:id",auth(),(req,res,next)=>{
    res.sendFile(path.join(process.cwd(),"public","chatbox.html"));
    next();
},sendMessage)
export default router;