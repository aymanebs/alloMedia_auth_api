const mongoose = require("mongoose");
const { Schema } = mongoose;

// Defining schema
const roleSchema = new Schema({
    name:{
        type: String,
        required:true,
        unique:true,
    }
}
);

// Creating model
const Role = mongoose.model("Role",roleSchema);

module.exports = Role;