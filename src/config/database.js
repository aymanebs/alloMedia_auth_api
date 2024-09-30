const mongoose = require("mongoose");
require("dotenv").config();


const connectdb = async ()=>{

    try{
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection to db successfull");
        
    }
    catch(error){
        console.error("Connection to db failed",error.message);
    }

}

module.exports = connectdb;