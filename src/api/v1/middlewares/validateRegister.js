const joi = require("joi");

const registerSchema = joi.object({

    name:joi.string().min(3).max(30).required(),
    email:joi.string().email().required(),
    password:joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9@]")).required(),
    confirm_password:joi.string().valid(joi.ref('password')).required(),
    address :joi.string().min(3).max(50).required(),
    phone:joi.string().length(10).required(),
});

validateRegister = (req,res,next) =>{

    const { error } = registerSchema.validate(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    next();

}

module.exports = validateRegister;
