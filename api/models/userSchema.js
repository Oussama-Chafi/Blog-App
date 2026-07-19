const { string, boolean } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type : String,
      enum : ["user" , "admin"],
      default : "user"
    },
    avatar : {
      type : String,
      default : function(){
        return `https://ui-avatars.com/api/?name=${this.first_name}+${this.last_name}&background=random&color=fff&size=128`
      },
    },
    isVerified : {
      type : Boolean,
      default : false,
    },
    verificationToken : {
      type : String ,
      default : null,
    },
    verificationTokenExpiry : {
      type : Date
    },
    resetToken : {
      type : String,
      default : null,
    },
    resetTokenExpiry : {
      type : Date,

    },
    loginAttampts : {
      type : Number , 
      default : 0,
    },
    lockUntil : {
      type : Date,
      
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
