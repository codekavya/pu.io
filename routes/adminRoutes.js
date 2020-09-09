const express = require("express");
const auth= require("../auth/auth.js");
const postUserSignUp = require("../controllers/adminController").postUserSignUp;
const deleteUsers = require("../controllers/adminController").deleteUsers;
const updateUsers = require("../controllers/adminController").updateUsers;
const postLogoutUsers = require("../controllers/adminController").postLogoutUsers; 
const postUserSignIn = require("../controllers/adminController").postUserSignIn;
const postLogoutAllSession = require("../controllers/adminController").postLogoutAllSession;

const getOneUser = require("../controllers/adminController").getOneUser;


const router = express.Router();

router.post("/signin",postUserSignIn);
router.post("/signup",postUserSignUp);

router.get("/user/me",auth,async(req,res)=>{
    console.log("Req came"+req.header("Authorization"))
    res.send(req.user);  
})
router.post("user/logout",auth,postLogoutUsers)
router.post("user/logout/all",auth,postLogoutAllSession)

router.delete("/users/:id",deleteUsers);
router.patch('/users/:id',auth,updateUsers);


module.exports = router;
