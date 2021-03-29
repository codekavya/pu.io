import express from "express";
const {
    Router
} = express;

import auth from "../auth/auth.js";

import {
    createRoom
} from "../controllers/chatsController.js"
const router = Router();


router.post("/create",auth(),createRoom);
router.get('/rooms',auth(),async(req,res,next)=>{
    res.send({
        rooms:req.user.rooms
    })
})
export default router;