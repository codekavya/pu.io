const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    Name:{
     type:String,
     trim:true,
     required:[true,'Enter the name']
    },
    
Email:{
    type:String,
    trim:true,
    unique:true,
    required:[true,'Enter your Valid Age'],
    validate(value){
        // if(!validator.isEmail(value)){
        //     throw new Error('Email Required')
        // }
    }
},
College:{
    type:String,
    trim:true,
    required:[true,'Enter your College Name'],
    
},
Faculty:{
    type:String,
    trim:true,
    required:[true,'Enter your Faculty'],
    
},
    Purpose:{
        type:String,
        trim:true,
        required:[true,'Email Address is Required']
    },

    isRequested:{
        type:Boolean,
        default:true
    },

    accepted:{
      type:Boolean,
      default:false
}
},{timestamps:true})



const Forms = mongoose.model("Forms",userSchema);

module.exports = Forms