const User  = require("../models/User");

module.exports = async (req,res,next)=>{

    const { email } = req.body;

    try{
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message:"email already registered"});
        }
        
        next();
    }

    catch(error){
        console.log(error);
        return res.status(500).json({message:"server error"});
        
    }
}