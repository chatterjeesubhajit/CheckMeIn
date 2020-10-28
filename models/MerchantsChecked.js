const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const merchantsCheckedSchema=new mongoose.Schema({
    placeId:{type:String,required:true,},
    companyName:{type:String,
      required:true,
      max:255}, 
      checkInTime:{
        type:Date,
        required:true,
        default:Date.now
    },
    position:{
      type:Number,
      required:true
  }
  });

  
  module.exports=merchantsCheckedSchema;

  