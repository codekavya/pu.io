const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');


// const {jwtsigninKey} =require("../config.json");
const userSchema = new mongoose.Schema({
    Name:{
     type:String,
     trim:true,
     required:[true,'Enter the name']
    },
    Age:{
        type:Number,
        trim:true,
        required:[true,'Enter your Valid Age'],
        validate(value){
            if(value<18){
                throw new Error('Age must be greater than 18')
            }
        }
},
    Email:{
        type:String,
        trim:true,
        unique:true,
        required:[true,'Email Address is Required'],
               validate(value){
                  if(!validator.isEmail(value))
                    throw new Error("Invalid Email");
                },
          },
    Password:{
        type:String,
        trim:true,
        required:[true,"Password is Needed"],
        minlength:7,
             validate(value){
                if(value.toLowerCase().includes('password'))
                    throw new Error("Type Strong Password")
            }
    },
    tokens:[{
        token:{
            required:true,
            type:String
        }
    }]
    
},{
    timestamps:true
});

userSchema.methods.getToken = async function(){
    const user = this;
    const token = jwt.sign({ _id : user._id.toString()},"thisisdemokey");
    user.tokens = user.tokens.concat({token})
    await  user.save()
    return token;
     
   }

   

userSchema.statics.findByProvideInfo = async (Email,password)=>{
    const user = await Users.findOne({ Email })
    if(!user){ 
        throw new Error("Unable to login in")}
    const isPasswordMatched = await bcryptjs.compare(password,user.Password);
    if(!isPasswordMatched){
        throw new Error("Invalid Email or Password")}
    return user;
};



userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('Password')){
        user.Password =  await bcryptjs.hash(user.Password,7);
    }

    next()
})



const Users = mongoose.model("Users",userSchema);

module.exports = Users