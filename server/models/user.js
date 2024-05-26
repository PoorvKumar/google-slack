const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const userSchema=new Schema({
    displayName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    googleId: { type: String },
    image: { type: String }
});

const User=mongoose.model("user",userSchema);
module.exports=User;