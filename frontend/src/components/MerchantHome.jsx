import React, { useState, useEffect,useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import {UsersInQueueContext} from "./UsersInQueueRepo";
import {LoginContext} from "./LoginContext";
import {useHistory} from "react-router-dom";
import AddStoreMap from "./AddStoreMap";

function Home({ match }) {
  let history = useHistory();
  if (window.location.hash === "#_=_") {
    history.replaceState
      ? history.replaceState(null, null, window.location.href.split("#")[0])
      : (window.location.hash = "");
  }
  const {usersInQueue, setUsersInQueue} = useContext(UsersInQueueContext);
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  console.log("merchant home page");

  useEffect(() => {
    axios
      .get("/merchant/auth/login/success", { withCredentials: true })
      .then((response) => {
        if(response.data.success){
          console.log("response: ",response.data);
        response.data.usersInQueue.length > 0
          ? setUsersInQueue(response.data.usersInQueue)
          : setUsersInQueue([]);
        }
        else
        {
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);        
      });
  }, []);

  return (
    <div>
    <Header />
    {loggedIn.status && <AddStoreMap/>}
      <Footer />
    </div>
  );
}

export default Home;
