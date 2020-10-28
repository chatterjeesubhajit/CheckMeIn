const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const mongoose = require("mongoose");
const merchantSchema = require("../models/Merchant");
const User= new mongoose.model("Merchant",merchantSchema);
var glob = require("glob");
var fs = require("fs");

const router = require("express").Router();
const { registerValidation,loginValidation } = require("../config/validation");
const bcrypt = require('bcryptjs');
const { file } = require("googleapis/build/src/apis/file");
const { all } = require("async");
const CLIENT_LOGIN_PAGE_URL = process.env.NODE_ENV ==='production'?"/":"http://localhost:3000/";
const cors=require("cors");
const axios =require("axios");
router.use(cors());


const authenticated = (req, res, next) => {
  if (!req.session.user) {
    res.redirect(CLIENT_LOGIN_PAGE_URL);
  }
  next()
}


router.post("/register", async (req, res) => {
  // console.log("reached merchant registration");
  // console.log(req.body);
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
    // console.log("saved user" ,savedUser);
    session["user"]=savedUser;
    res.json({
      status:true,
      message:"succcess",
      displayName:displayname,
      type:"merchant"
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
    // console.log("user is authenticated, below are details");
    // console.log(req.session.user);
    // console.log("session details");
    // console.log(req.session);

      User.findOne({username:req.session.user.username},(err,obj)=>{
        let usersInQueue=[];
        if(!err){
          if(obj)
          {
            usersInQueue=obj.usersInQueue;
          }
          res.json({
          success: true,
          type:"merchant",
          message: "user has successfully authenticated",
          user: req.session.user,
          usersInQueue:usersInQueue
            }); 
          }
      })
  }
    else
    {
      res.json({
        success: false,
        type:"merchant",
        message: "user authentication failed",
        user: {},
        usersInQueue:[]
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

  // console.log("user found",user);

  const comp= await bcrypt.compare(req.body.password,user.password);
  if(!comp) return res.status(401).send({
    authenticate: false,
    message: "Passwords don't match"
  });
  session["user"] = user;
  session["userType"]="merchant";
  if(user.username==="admin@gmail.com")
  {
    session["admin"]=true
    registerMerchants();
  }
  return res.status(200).send({authenticate:true,displayName:user.displayName,type:"merchant"});
});

router.get("/logout",authenticated,async (req,res)=>{
  console.log("reached merchant logout");
  req.session.destroy(function(err){
    if(err){
       console.log(err);    
    }else{
      res.redirect(CLIENT_LOGIN_PAGE_URL);        
    }
 });
//  console.log("session now: ",req.session);  
})

const registerMerchants = async () =>{

  let fullList= await fetchData();
  console.log("result length:" ,fullList.length);


  for(var i=0;i<fullList.length;i++)
  {
    
    var url=`https://maps.googleapis.com/maps/api/place/details/json?place_id=${fullList[i].place_id}&fields=name,rating,formatted_phone_number,opening_hours,address_component,adr_address,business_status,formatted_address,geometry,icon,website,type,url&key=${process.env.google_key}`        

    // console.log("url: ",url);
    let {data: {result}} = await axios.get(url);
    let username="merchant"+i+"@gmail.com"
    let displayName="Merchant"+i;
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash("Being#801",salt);
    let emailExists = await User.findOne({ placeId: fullList[i].place_id });
    try{
    if (!emailExists){
    //  if(i===19 || i===20)
    //  {
    //    console.log("result for the problem: ",result);
    //  } 
     if(result.opening_hours !== undefined){
    let user = new User({
      username: username,
      displayName:displayName,
      password: hashedPassword,
      companyName:result.name,
      streetAddress:result.formatted_address,
      zipCode:result.address_components[result.address_components.length-1].short_name,
      placeId:fullList[i].place_id,
      icon:result.icon,
      phone:result.formatted_phone_number,
      types:result.types,
      opHours:result.opening_hours.weekday_text,
      rating:result.rating,
      lat:result.geometry.location.lat,
      lng:result.geometry.location.lng,
      website:result.website,
      url:result.url,
      limitOnPeople:10
    });
    let savedUser = await user.save();  
  }
  else {
    let user = new User({
      username: username,
      displayName:displayName,
      password: hashedPassword,
      companyName:result.name,
      streetAddress:result.formatted_address,
      zipCode:result.address_components[result.address_components.length-1].short_name,
      placeId:fullList[i].place_id,
      icon:result.icon,
      phone:result.formatted_phone_number,
      types:result.types,
      opHours:[],
      rating:result.rating,
      lat:result.geometry.location.lat,
      lng:result.geometry.location.lng,
      website:result.website,
      url:result.url,
      limitOnPeople:10
    });
    let savedUser = await user.save();  
  }
    
  }
     
}
catch(err){
  console.log("error: ",err);
};

  // console.log("saved data for ",result.name,"is :",savedUser);

  }
}

const fetchData = async ()=>{
  // console.log("fetching data");  
  let allMerchants=[];
  let files= glob.sync('../backend/data/*.json');      

  if(files.length>0){
      for(var i=0;i<files.length;i++){
        // console.log("file: ",file);
       let data= fs.readFileSync(files[i], {encoding:'utf8'});
        let output = JSON.parse(data);          
        allMerchants = allMerchants.concat(output.results);    
          console.log("master array length now:" , allMerchants.length);                  
        if(i===files.length-1)
        {
        console.log("master array length final:" , allMerchants.length);      
        return allMerchants;
        }
      };
    }
    else
    return ("no files")
 
}



module.exports = router;
