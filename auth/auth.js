const jwt= require('jsonwebtoken');
const Users = require('../models/adminModels');
const auth = async(req,res,next)=>{
   try{
    const token = req.header('Authorization').replace("Bearer ","");
    const payload = jwt.verify(token,"thisisdemokey");
    const user = await Users.findOne({_id:payload._id , 'tokens.token':token});
    if(!user){
        throw new Error();
    }
    req.token = token
    req.user = user;
   next();
    }catch(e){
        res.send({Error:"Unable to Authorize"})
       
   }
}

module.exports =auth