const mongoose = require("mongoose");
const usersInQueueSchema = new mongoose.Schema({
username: {type:String,
    required:true,
    max:255
},
displayName:{
    type:String,
    required:true,
    min:6,
    max:255
},
checkInDate:{
    type:Date,
    required:true,
    default:Date.now
},
position:{
    type:Number,
    required:true
}

});

module.exports=usersInQueueSchema;
