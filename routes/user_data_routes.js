const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const mongoose = require("mongoose");
const userSchema = require("../models/User");
const User= new mongoose.model("User",userSchema);
const merchantSchema = require("../models/Merchant");
const Merchant= new mongoose.model("Merchant",merchantSchema);
const usersInQueueSchema= require("../models/UsersInQueue");
const usersInQueue= new mongoose.model("usersInQueue",usersInQueueSchema);
const merchantsCheckedSchema= require("../models/MerchantsChecked");
const merchantsChecked= new mongoose.model("merchantsChecked",merchantsCheckedSchema);




const router = require("express").Router();
const { registerValidation,loginValidation } = require("../config/validation");
const bcrypt = require('bcryptjs');
const CLIENT_LOGIN_PAGE_URL = process.env.NODE_ENV ==='production'?"/":"http://localhost:3000/";

const cors=require("cors");
const axios =require("axios");
router.use(cors());

const authenticated = (req, res, next) => {
  if (!req.session.user) {
    res.redirect(CLIENT_LOGIN_PAGE_URL);
  }
  next()
};

router.post("/find", async (req, res) => 
{
  console.log("reached user data find");
    console.log(req.body);
    var url=`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.body.coords.lat},${req.body.coords.lng}&radius=${req.body.miles}&type=${req.body.search}&key=${process.env.google_key}`
    console.log("url is: ",url);
    let {data: { results}} = await axios.get(url);
    if(results !== undefined )
    {
      // console.log(results);
      console.log("no. of places obtained:",results.length);
      let placesObtained =results.map(r=> { return {placeId:r.place_id,name:r.name}});
      console.log("places Obtained: ",placesObtained);
      let placeIdsObtained =await results.map(r=> { return r.place_id});
      console.log("places obtained:",placeIdsObtained);

      Merchant.find( { placeId: {$in: placeIdsObtained}})
       .then ((response)=>{
        console.log("db resp: ",response);
        return res.json({
          done:true,
          message:"succcess",
          merchants:response
        });
       })
       .catch(err=>{
        console.log("db resp: ",error.message);
        return res.json({
          done:false,
          message:err.message,
          merchants:[]
        });

       })
      
    }
    else{
      return res.json({
        done:false,
        message:"failure in retrieving any restaurant",
        merchants:[]
      });
    }    
});

// const usersInQueue= new mongoose.model("usersInQueue",usersInQueueSchema);
// const merchantsChecked= new mongoose.model("merchantsChecked",merchantsCheckedSchema);
router.post("/checkin", async (req, res) => 
{

try{
// console.log("session: ",req.session);
console.log("body: ",req.body);
const inQUser= await new usersInQueue({
    username: req.session.user.username,
    displayName:req.session.user.displayName,
    position:parseInt(req.body.checkIn.position)
  });
console.log("inQUser:",inQUser);
await Merchant.updateOne({"placeId":req.body.checkIn.placeId,"usersInQueue.username": {$ne:req.session.user.username}}, {"$push":{"usersInQueue":inQUser}})
let MerchantInfo=await Merchant.findOne({ "placeId":req.body.checkIn.placeId},{"placeId":1,"companyName":1});
console.log(MerchantInfo);

const checkedMerchant= await new merchantsChecked({
  placeId: MerchantInfo.placeId,
  companyName:MerchantInfo.companyName,
  position:parseInt(req.body.checkIn.position)
});
await User.updateOne({"username":req.session.user.username,"checkedInMerchants.placeId": {$ne: MerchantInfo.placeId}}, {"$push":{"checkedInMerchants":checkedMerchant}});


return res.json({
  done:true,
  message:"succcessfully saved user",
});
}
catch(err){
  console.log("error: ",err);
    return res.json({
      done:false,
      message:"failed to add user in queue to merchant",
    });
}

})


router.post("/checkout", async (req, res) => 
{

try{
// console.log("session: ",req.session);
console.log("body: ",req.body);
await User.updateOne({"username":req.session.user.username},{$pull:{checkedInMerchants:{ placeId:req.body.checkOut.placeId}}});
await Merchant.updateOne({"placeId":req.body.checkOut.placeId},{$pull:{usersInQueue:{username:req.session.user.username}}});
io.sockets.in("checkInQueue").emit('message', req.body.checkOut);

// const inQUser= await new usersInQueue({
//     username: req.session.user.username,
//     displayName:req.session.user.displayName,
//     position:parseInt(req.body.checkIn.position)
//   });
// console.log("inQUser:",inQUser);
// await Merchant.updateOne({"placeId":req.body.checkIn.placeId,"usersInQueue.username": {$ne:req.session.user.username}}, {"$push":{"usersInQueue":inQUser}})
// let MerchantInfo=await Merchant.findOne({ "placeId":req.body.checkIn.placeId},{"placeId":1,"companyName":1});
// console.log(MerchantInfo);

// const checkedMerchant= await new merchantsChecked({
//   placeId: MerchantInfo.placeId,
//   companyName:MerchantInfo.companyName,
//   position:parseInt(req.body.checkIn.position)
// });
// await User.updateOne({"username":req.session.user.username,"checkedInMerchants.placeId": {$ne: MerchantInfo.placeId}}, {"$push":{"checkedInMerchants":checkedMerchant}});


return res.json({
  done:true,
  message:"succcessfully saved user",
});
}
catch(err){
  console.log("error: ",err);
    return res.json({
      done:false,
      message:"failed to add user in queue to merchant",
    });
}

})




module.exports = router;
