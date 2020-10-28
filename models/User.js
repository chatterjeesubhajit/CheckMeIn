const mongoose = require("mongoose");
const merchantsCheckedSchema = require("./MerchantsChecked");
const userSchema = new mongoose.Schema({
username: {type:String,
    required:true,
    max:255
},
password:{
    type:String,
    required:true,
    min:6,
    max:1024
},
displayName:{type:String,
    required:true,
    min:6,
    max:255},

date:{
    type:Date,
    default:Date.now
},
checkedInMerchants:[merchantsCheckedSchema]
});

module.exports =userSchema;
