const express = require("express");
const auth= require("../auth/auth.js");
const postUserSignUp = require("../controllers/adminController").postUserSignUp;
const deleteUsers = require("../controllers/adminController").deleteUsers;
const updateUsers = require("../controllers/adminController").updateUsers;
const postLogoutUsers = require("../controllers/adminController").postLogoutUsers; 
const postUserSignIn = require("../controllers/adminController").postUserSignIn;
const postLogoutAllSession = require("../controllers/adminController").postLogoutAllSession;
const postreqForm = require("../controllers/adminController").reqForm;
const getAPIKEY = require("../controllers/adminController").getAPIKEY;
const generate = require("../auth/generateKey")

const router = express.Router();

router.post("/signin",postUserSignIn);
router.post("/signup",postUserSignUp);
router.post("/key",auth,generate,postreqForm)

router.get("/user/me",auth,async(req,res)=>{
    res.send(req.user);  
})
router.get("/user/details",auth,getAPIKEY)
router.post("user/logout",auth,postLogoutUsers)
router.post("user/logout/all",auth,postLogoutAllSession)

router.delete("/users/:id",auth,deleteUsers);
router.patch('/users/:id',auth,updateUsers);


module.exports = router;
