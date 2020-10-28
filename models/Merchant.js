const mongoose = require('mongoose');
const usersInQueueSchema =require("./UsersInQueue");
require('mongoose-long')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const merchantSchema=new mongoose.Schema({
    username: {type:String,
      required:true,
      max:255
    },

    displayName:{type:String,
      required:true,
      min:6,
      max:255},

    password:{
        type:String,
        required:true,
        min:6,
        max:1024
    },
    companyName:{type:String},
    placeId:{type:String},
    dateRegistered:{
        type:Date,
        default:Date.now
    },
    streetAddress:{type:String},
    zipCode:{type:String},
    icon:{type:String},
    phone:{type:String},
    types:[{type:String}],
    rating:{type:mongoose.Schema.Types.Decimal128},
    lat:{type:mongoose.Schema.Types.Decimal128},
    lng:{type:mongoose.Schema.Types.Decimal128},
    website:{type:String},
    url:{type:String},
    opHours:[{type:String}],
    usersInQueue:[usersInQueueSchema],
    limitOnPeople:{type:Number}
  });
  module.exports=merchantSchema;

  