import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import classNames from "classnames";
import Register from "./RegisterTab";
import LoginTab from "./LoginTab";
import { FcGoogle } from "react-icons/fc";


function SignUp() {
  const containerClasses = classNames("container");
  const btnClasses = classNames("btn", "btn-block", "btn-social", "btn-google");
  const navClasses = classNames("nav", "nav-tabs");
  const navItemClasses = classNames("nav-link", "active");
  console.log("sign up");


  // const tabStyle = {width: "20rem" };

  const [register, setRegister] = useState(false);
  function registerClick() {
    setRegister(true);
  }
  function loginClick() {
    setRegister(false);
  }

  return (
    <div>
      <Header />
      <div style={{margin:"0",padding:"1%"}} className="container">
        <ul className={navClasses}>
          <li className="nav-item">
            <button onClick={loginClick} className={navItemClasses}>
              Login
            </button>
          </li>
          <li style={{ paddingLeft: "0.5rem" }} className="nav-item">
            <button onClick={registerClick} className="nav-link">
              Register
            </button>
          </li>
        </ul>
        <div className="row">
        <div className="col-sm-6">
          {register ? (
            <div style={{paddingTop:"2%"}}>
              <Register />
            </div>
          ) : (
            <div>
              <div className="card-body">
                <LoginTab />
              </div>
            </div>
          )}
        </div>
        <div className="col-sm-6">
          <div
            style={{
              color: "white"
            }}
          >
            <h1 style={{textShadow:"2px 2px black"}}>Check Me In</h1>
            <ul>
              <h3>Keep COVID-19 at a distance!</h3>
              <ul>
              <li>During these times of pandemic, social distancing is essential</li>
              <li>This app will help users find merchants near by and check-in to the digital queue</li>  
              <li>No more risk of overcrowding at places. No more standing in Queue!</li>
              <li> Click on Register to register yourself to get the most
                personalised experience</li>
                <li> Merchants - You can use this app to gauge the footfall in your establishment in real-time!</li>
              </ul>
            </ul>
          </div>
        </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default SignUp;
