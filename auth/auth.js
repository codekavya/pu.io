const jwt= require('jsonwebtoken');
const Users = require('../models/adminModels');
const spliter = require('../Utils/__cookies__extracter')
const auth = async(req,res,next)=>{
   try{
    const token = req.header('Cookie').replace("SKey=Bearer ","");
    console.log(token)
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