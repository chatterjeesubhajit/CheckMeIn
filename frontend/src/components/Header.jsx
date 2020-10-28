import React,{useContext} from "react";
import HighlightIcon from "@material-ui/icons/Highlight";
import classNames from "classnames";
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';
import {LoginContext} from "./LoginContext";
import HomeIcon from '@material-ui/icons/Home';
import NavComponent from "./NavComponent";
import logo from "../logo2.png";
import {Navbar,Nav,Form,Button, NavDropdown}  from 'react-bootstrap';
function Header() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);

  const headerAnchors = classNames('btn','btn-lg');
  const navBranClass = classNames("navbar","navbar-expand-lg","navbar-dark");
  const navBranImgClass = classNames("d-inline-block","align-top");
  const homeRoute="/home/"+loggedIn.displayName;
  const headerPadding={
    paddingLeft:"10rem"
  };
  const clearSession = () => {
    setLoggedIn({displayName:'',type:"",status:false});
    sessionStorage.clear();
  }


return (
    <header>  
   {loggedIn.status?<NavComponent clearSession={clearSession} />: 
  <Navbar expand="lg" sticky="top">
    <Navbar.Brand href={homeRoute}>
    <img style={{float:"left"}} src={logo} width="80" height="60" className={navBranImgClass} alt="CheckMeIn logo"/>
    <h3 style={{paddingTop:"2%"}}>Welcome to CheckMeIn</h3>
    </Navbar.Brand>
    </Navbar>
   }
   
    </header>
  );
}

export default Header;
