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
const { indexOf } = require("lodash");
const CLIENT_LOGIN_PAGE_URL = process.env.NODE_ENV ==='production'?"/":"http://localhost:3000/";


const authenticated = (req, res, next) => {
  if (!req.session.user) {
    res.redirect(CLIENT_LOGIN_PAGE_URL);
  }
  next()
}

router.post("/register", async (req, res) => {
  console.log("reached merchant registration");
  console.log(req.body);
  let session = req.session;
  let displayname=req.body.firstname+" "+req.body.lastname;
 
  const emailExists = await User.findOne({ username: req.body.username });
  if (emailExists) return res.status(400).json({
    status:false,
    message:"Email already registered!"
})
    
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password,salt);
  const user = new User({
    username: req.body.username,
    displayName:displayname,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    console.log("saved user" ,savedUser);
    session["user"]=savedUser;
    res.json({
      status:true,
      message:"succcess",
      displayName:displayname,
      type:"user"
    });

  } catch (err) {
    console.log("error", err);
    res.status(400).json({
      status:false,
      message:"Unable to Register, Please try again!"
  })
  }
});

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
  console.log("incoming user data");
  console.log(req.session.user);
  console.log("user type:",req.session.userType);
  if(req.session.user)
  {
    console.log("user is authenticated, below are details");
    // console.log(req.session.user);
    console.log("session details");
    // console.log(req.session);
    const session = req.session;
    // io.sockets.connected[session.socketio].emit('show', `${req.session.user.displayName}`);

      User.findOne({username:req.session.user.username},async (err,obj)=>{
        let checkedInMerchants=[];
        if(!err){
          if(obj)
          {
            checkedInMerchants=obj.checkedInMerchants;
            if(checkedInMerchants.length>0){
            // console.log("checkedIn merchants for the user",checkedInMerchants);
            let allPlaceIds=checkedInMerchants.map(merch=>merch.placeId);
            // console.log("allplaceids: ",allPlaceIds);
            let out1=(await Merchant.find({placeId:{$in:allPlaceIds}},{_id:0,placeId:1,"usersInQueue.username":1})).map(item=>{ return {placeId:item.placeId,users:item.usersInQueue.map(user=>{return user.username})}});              
            // console.log("out1: ",out1);
            checkedInMerchants=checkedInMerchants.map(merchant=>{
              return { checkInTime:merchant.checkInTime,                
                placeId:merchant.placeId,
                companyName:merchant.companyName,
                position:out1.filter(merch=>merch.placeId===merchant.placeId)
                .map(merch=>merch.users.indexOf(req.session.user.username))[0]+1}});
              }

            console.log("checkedInMerchants: ",checkedInMerchants);

          }
          res.json({
          success: true,
          type:"user",
          message: "user has successfully authenticated",
          user: req.session.user,
          checkedInMerchants:checkedInMerchants
            }); 
          }
      })
  }
    else
    {
      res.json({
        success: false,
        type:"user",
        message: "user authentication failed",
        user: {},
        checkedInMerchants:[]
          }); 
    }
  });

router.post("/login",async (req,res)=>{
    let session = req.session;
    const user = await User.findOne({ username: req.body.username });
    if (user === null) return res.status(401).send({
      authenticate: false,
      message: "Email not registered"
    });

    console.log("user found",user);

    const comp= await bcrypt.compare(req.body.password,user.password);
    if(!comp) return res.status(401).send({
      authenticate: false,
      message: "Passwords don't match"
    });
    session["user"] = user;
    session["userType"]="user";
    return res.status(200).send({authenticate:true,displayName:user.displayName,type:"user"});
});


router.get("/logout",authenticated,async (req,res)=>{
  console.log("reached user logout");
  req.session.destroy(function(err){
    if(err){
       console.log(err);    
    }else{
      res.redirect(CLIENT_LOGIN_PAGE_URL);        
    }
 });
 console.log("session now: ",req.session);  
})

module.exports = router;
