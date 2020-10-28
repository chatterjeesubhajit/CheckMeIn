import React, { useState, useEffect,useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {CheckedInMerchantsContext,AllMerchantsContext} from "./CheckedInMerchantsRepo";
import {LoginContext} from "./LoginContext";
import FindMerchant from "./FindMerchant";
import {Container,Row,Col}  from 'react-bootstrap';


// const io= require("socket.io-client");

function Home({ match }) {
  // var socket = io.connect("http://localhost:5000");
  

//  socket.on('show', function(data) {
//   console.log('Incoming message:', data);
// });

  let history = useHistory();
  if (window.location.hash === "#_=_") {
    history.replaceState
      ? history.replaceState(null, null, window.location.href.split("#")[0])
      : (window.location.hash = "");
  }
  const {checkedInMerchants, setCheckedInMerchants} = useContext(CheckedInMerchantsContext);
  const {allMerchants, setAllMerchants} = useContext(AllMerchantsContext);
  const [center,setCenter]=useState({lat: 33.0061, lng: -96.7026});
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  console.log(" user home page");
  // const { params: { userName } = {} } = match;

  var rad = function(x) {
    return x * Math.PI / 180;
  };
  
  var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng- p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  };


  useEffect(() => {

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
        setCenter({lat:position.coords.latitude,lng:position.coords.longitude});
      });
      
    }

    axios
      .get("/user/auth/login/success", { withCredentials: true })
      .then((response) => {
        if(response.data.success){
          console.log("response: ",response.data);
        response.data.checkedInMerchants.length > 0
          ? setCheckedInMerchants(response.data.checkedInMerchants)
          : setCheckedInMerchants([]);
        }
        else
        {
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });

      axios
      .get("/merchant/data/allMerchants", { withCredentials: true })
      .then((resp)=>{
        console.log("resoponse from all merchants: ",resp);

        if(resp.data.response.length > 0)
        {           
          setAllMerchants(resp.data.response.map((merchant)=>{ return { ...merchant,
            ["lat"]:parseFloat(merchant.lat["$numberDecimal"]),["lng"]:parseFloat(merchant.lng["$numberDecimal"]),
              ["distanceFromCenter"]:getDistance({lat:parseFloat(merchant.lat["$numberDecimal"]),lng:parseFloat(merchant.lng["$numberDecimal"])},center)
            }}))
        
        }
        else {
        setAllMerchants([]);
      }

      }).catch((err)=>{
        console.log("error in fetching all merchants: ",err);
      }
    );

  }, []);

  return (
    <div>
    <Header />
      {loggedIn.status &&
        <Container fluid style={{paddingTop:"1%"}}>         
          <FindMerchant/>      
      </Container>
      }
      <Footer />
    </div>
  );
}

export default Home;
