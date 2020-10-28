//jshint esversion:6

let moment = require('moment'); 
require("dotenv").config({ path: "./.env" });
fs = require("fs");
path = require('path');

const express = require("express");

var Session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
const cors=require("cors");

const sessionMiddleWare=Session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
})

let port=process.env.PORT;
if(port==null || port== "")
{
  port=5000;
};

var server    = app.listen(port);
io        = require('socket.io')(server, {
  handlePreflightRequest: (req, res) => {
      const headers = {
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true
      };
      res.writeHead(200, headers);
      res.end();
  }
});



app.use(cors());

const qs = require('qs'); 
mongoose = require("mongoose");
require('mongoose-long')(mongoose);

util = require('util');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const CLIENT_LOGIN_PAGE_URL = process.env.NODE_ENV ==='production'?"/":"http://localhost:3000/";

const userAuthRoutes = require("./routes/user_auth_routes");
const merchantAuthRoutes = require("./routes/merchant_auth_routes");
const merchantDataRoutes = require("./routes/merchant_data_routes");
const userDataRoutes = require("./routes/user_data_routes");
// const dbUri=process.env.NODE_ENV ==='production'?process.env.DB_PROD_URI:process.env.DB_URI;

app.use(sessionMiddleWare);
// io.use(function(socket, next) {
//   sessionMiddleWare(socket.request, socket.request.res, next);
// });

io.on('connection', (socket) => {
  // socket.handshake.headers
  socket.on('room', function(room) {
    socket.join(room);
});

  // socket.request.session.socketio = socket.id;
  // socket.request.session.save();
});


mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to db successfully");
    }
  }
);

mongoose.set("useCreateIndex", true);
mongoose.plugin(schema => { schema.options.usePushEach = true });



// app.set("view engine", "ejs");

app.use("/user/auth", userAuthRoutes);
app.use("/merchant/auth", merchantAuthRoutes);
app.use("/merchant/data", merchantDataRoutes);
app.use("/user/data", userDataRoutes);


// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "./build")));
const authCheck = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

if(process.env.NODE_ENV==="production"){
  app.get("*", authCheck, (req, res) => {
    res.sendFile(path.join(__dirname, './build', 'index.html'));
  });  
}
else
{
  app.get("/", authCheck, (req, res) => {
    res.redirect(`${CLIENT_LOGIN_PAGE_URL}${req.session.userType}/home/${req.session.user.displayName}`);
    // res.status(200).json({
    //   authenticated: true,
    //   message: "user successfully authenticated",
    //   user: req.session.user,
    //   userType:req.session.userType,
    //   cookies: req.cookies
    // });
    
  });
}


  

// setInterval(myFunc,5000,'hey there');





// app.listen(port, function(){
//   console.log("connected to server successfully...");
// });
