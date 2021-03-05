const express = require("express");
const body_parser = require('body-parser');
const auth= require("../auth/auth.js");
const postUserSignUp = require("../controllers/adminController").postUserSignUp;
const deleteUser = require("../controllers/adminController").deleteUser;
const updateUser = require("../controllers/adminController").updateUser;
const postLogoutUsers = require("../controllers/adminController").postLogoutUsers; 
const postUserSignIn = require("../controllers/adminController").postUserSignIn;
const postLogoutAllSession = require("../controllers/adminController").postLogoutAllSession;
const postreqForm = require("../controllers/adminController").postreqForm;
const getAPIKEY = require("../controllers/adminController").getAPIKEY;
const generate = require("../auth/generateKey")

const limiter = require('../controllers/adminController').limitForAccount

const router = express.Router();

const parser = body_parser.urlencoded({extended:false})


router.use(limiter,parser)


//Frontend endpoints only for Development
router.get('/login',(req,res)=>{
    res.send('<form action="/signin" method="POST"><input type="email" name="Email" id="Email"><input type="password" name="Password" id="pwd"><button type="submit">Send</button></form>')
})
router.get('/form',(req,res,next)=>{
    res.send('<form action="/signup" method="POST">Name:<input type="text" name="Name"><br>Age:<input type="number" name="Age"><br>Email:<input type="Email" name="Email"><br>Password:<input type="password" name="Password"><button type="submit">Send</button></form>')
});
router.get('/rkey',(req,res,next)=>{
    res.send('<form action="/key" method="POST">Name:<input type="text" name="Name"><br>Password:<input type="password" name="Password"><br>Email:<input type="Email" name="Email"><br>Faculty:<input type="text" name="Faculty"><br>College:<input type="text" name="College"><br>Purpose:<textarea name="Purpose"></textarea><br><button type="submit">Send</button></form>')
});


router.post("/signup",postUserSignUp);
router.post("/key",auth,postreqForm);
router.post("/signin",postUserSignIn);


router.get("/user/me",auth,async(req,res)=>{
    res.send(req.user);  
})

router.post("user/logout",auth,postLogoutUsers)
router.post("user/logout/all",auth,postLogoutAllSession)

router.delete("/users/:id",auth,deleteUser);
router.patch('/users/:id',auth,updateUser);


module.exports = router;
