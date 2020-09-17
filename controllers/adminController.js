const Users = require('../models/adminModels');
const Forms = require('../models/form');


exports.postUserSignUp = async(req, res) => {
    const user =  new Users(req.body)
 
    try{ 
        await user.save();
        const token = await user.getToken();   
        res.send({user,token})
   
 }
 catch(E){res.send(E)}
 
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
    const token=  user.getToken();   
        res.send({user,token})
    }catch(error){
        res.status(401).send({Error:"Error Logging",error})
    }
}
exports.getAPIKEY = async(req,res)=>{
    const user = req.user;
    if(user.apiKey!=null){
       return res.status(404).send("No Key Found Try Sendig A Form or Wait for Response")
    }
       return res.send({"Api Key":user.apiKey,userProfile:user})

}

exports.reqForm = (req,res)=>{ 
    var message = req.message;
    console.log(message)
         if(message===100){
                const form = new Forms(req.body);
                form.isRequested=true;
                  form.save().then(function(response,error){
                      if(response){
                          res.status(208).send({"msg":"Under Validation"})
                      }
                  })
            }
    
        else if(message===201|| message===101){
            res.status(201).send({apiKey:req.user.apiKey})
        }
        else{
            return res.status(208).send({"msg":"Under Validation"})

        }
       
       
    }
    
  
   exports.deleteUsers = async (req, res, next)=>{
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

 
  exports.updateUsers = async(req,res,next)=>{
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




  