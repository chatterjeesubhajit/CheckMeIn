const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const mongoose = require("mongoose");
const merchantSchema = require("../models/Merchant");
const User= new mongoose.model("Merchant",merchantSchema);

const router = require("express").Router();
const { registerValidation,loginValidation } = require("../config/validation");
const bcrypt = require('bcryptjs');
const CLIENT_LOGIN_PAGE_URL = process.env.NODE_ENV ==='production'?"/":"http://localhost:3000/";


const authenticated = (req, res, next) => {
  if (!req.session.user) {
    res.redirect(CLIENT_LOGIN_PAGE_URL);
  }
  next()
};

router.post("/add", async (req, res) => 
{
    console.log(req.body);

    User.updateOne({"username":req.session.user.username}, {"$set": {
      companyName:req.body.name,
      placeId:req.body.placeId,
      streetAddress:req.body.address,
      zipCode:req.body.zip,
      icon:req.body.icon,
      phone:req.body.phone,
      types:req.body.types,
      rating:req.body.rating,
      lat:req.body.lat,
      lng:req.body.lng,
      website:req.body.website,
      url:req.body.url,
      opHours:req.body.opHours,
      limitOnPeople:req.body.limitOnPeople
    }})
    .then ((response) =>{
      console.log(response);
      return res.json({
        done:true,
        message:"succcess"
      });
    })
    .catch( (error)=>{
      console.log(error);
      return res.json({
        done:false,
        message:error.message
      });
    })

});

router.get("/allMerchants", async (req, res) => 
{
    // User.find({username:{$ne:"admin@gmail.com"}},{username:0,password:0,usersInQueue:0,displayName:0,dateRegistered:0})
    User.aggregate( [
      {$match: {username:{$ne:"admin@gmail.com"}}},
      {
        $project: {        
        numUsersInQueue: { $cond: { if: { $isArray: "$usersInQueue" }, then: { $size: "$usersInQueue" }, else: "0"}},
        placeId:1,
        types:1,
        companyName:1,
        opHours:1,
        icon:1,
        phone:1,
        rating:1,
        lat:1,
        lng:1,
        streetAddress:1,
        zipCode:1,
        website:1,
        url:1,
        limitOnPeople:1
      }
      }
     ])
    .then ((response) =>{
      //        "username":0,"password":0,"usersInQueue":0,"displayName":0,"dateRegistered":0
      // console.log(response);
      return res.json({
        done:true,
        message:"succcess",
        response:response
      });
    })
    .catch( (error)=>{
      console.log(error);
      return res.json({
        done:false,
        message:error.message,
        response:response
      });
    })

});

module.exports = router;
