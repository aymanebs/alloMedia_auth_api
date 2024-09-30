const { boolean, required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");


// Defining schema
const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        validate : (value) => validator.isEmail(value),
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    emailIsVerified:{
        type:Boolean,
        required:true,
        default:false,
    },
    role_id:{
        type:Schema.Types.ObjectId,
        ref:"Role",
    },
},{timestamps:true});

//model creation
const User = mongoose.model("User",userSchema);

module.exports = User;