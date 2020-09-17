const jwt= require('jsonwebtoken');
const Users = require('../models/adminModels');
const Forms = require('../models/form');
const gen = async(req,res,next)=>{
   try{
    const Email = req.body.Email;
    const form = await Forms.findOne({Email})
    const user = await Users.findOne({Email})
    var message =100;
   
if(form && form.accepted&&user.apiKey==null){
    const akey =  user.getAPIKEY();
     form.deleteOne(form)
    var message = 201;
    req.key = akey;
    req.form = form;
}
else if(!form && user.apiKey!=null)message =101;
else if(form && user.apiKey==null)message =109;

   req.user =user;
   req.message =message
   next();
    }catch(e){
      res.status(203).send("Invalid Email")
       
   }
}

module.exports =gen