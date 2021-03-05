const limiter = require('express-rate-limit');


const Users = require('../models/adminModels');
const Forms = require('../models/form');

const api_Key_Generator = require('../auth/generateKey')


const limitForAccount = limiter({
    windowMs:60*60*1000, //time limit in milisecond to rate limit
    max:10, //max 100 request for each ip address within given windowsMs
    message:'Sorry too many request try after some time'
})

exports.limitForAccount = limitForAccount;



exports.postUserSignUp = async(req, res) => {
    console.log(req.body);
    const user =  new Users(req.body)
    await user.save();
 
    try{ 
        await user.save();
        res.send({'Account':user})
   
 }
 catch(E){
     res.send(E)

    }
 
 };
  exports.postLogoutAllSession = async(req, res, next) => {
    try {
        req.user.tokens=[];
        await req.user.save();
       

    } catch (error) {
        res.status(500).send(error)
    }
   

};

  exports.postUserSignIn = async(req,res)=>{  
    try{
    const user = await Users.findByProvideInfo(req.body.Email,req.body.Password)
    const token= await user.getToken();
    res.set({
            'Content-Type':'text/html',
            'Set-Cookie':`SKey = Bearer ${token}`      
    });  
    res.send({user,token}) 
    
    }catch(error){
        res.status(401).send({Error:"Error Logging",error})
    }
}

//Needed to be tested
exports.getAPIKEY = async(req,res)=>{
    const user = await User.findOne({})
    if(user.apiKey!=null){
       return res.status(404).send("No Key Found Try Sendig A Form or Wait for Response")
    }
       return res.send({"Api Key":user.apiKey,userProfile:user})

}

/*This endpoint is responsible for posting the form and checking if
the user has requested for the API Key 
*/

exports.apiHandler = async(req,res,next)=>{
    if(req.user.apiKey){
        res.status(200).send(req.user);

    }else if(req){

    }else{
        res.redirect('/rkey')
    }
}

exports.postreqForm = async (req,res,next)=>{
    api_Key_Generator(req,res,next);
}
    
  
   exports.deleteUser = async (req, res, next)=>{
      try {
          const usertoDelete = await Users.findByIdAndDelete(req.params.id);
          if(!usertoDelete){
              res.status(404).send("No user Found");
              res.send(usertoDelete);
          }
      } catch (error) {
          res.status(500)
      }
    
  };

 
  exports.updateUser = async(req,res,next)=>{
    const isallowed = ['Name', 'Password'];
    const entity = Object.keys(req.body);
    const isValid = entity.every(data => isallowed.includes(data));
    if (!isValid)
        return res.status(401).send('Invalid Operation')

    try {
        entity.forEach(entry=>{ req.user[entry] = req.body[entry]});
        await req.user.save()

        res.status(201).send()
    }
    catch (e) { res.status(404).send(e) };
         
  }
  exports.postLogoutUsers = async (req,res,next)=>{

    try {
        req.user.tokens = req.user.tokens.filter(token=>{
            return token.token!=req.token
        })
        await req.user.save()
        res.send()

    } catch (error) {
        res.status.send(500);
    }
     
  }




  