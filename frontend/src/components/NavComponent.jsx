import React,{useContext} from "react";
import HighlightIcon from "@material-ui/icons/Highlight";
import classNames from "classnames";
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';
import {LoginContext} from "./LoginContext";
import HomeIcon from '@material-ui/icons/Home';
import {Navbar,Nav,Form,Button, NavDropdown}  from 'react-bootstrap';
import logo from "../logo2.png";

const NavComponent =(props)=> {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);

  const headerAnchors = classNames('btn','btn-lg');
  const navBranImgClass = classNames("d-inline-block","align-top");
  const homeRoute="/"+loggedIn.type+"/home/"+loggedIn.displayName;
  const userDetailsRoute="/"+loggedIn.type+"/userDetails";
  const merchantDetailsRoute="/"+loggedIn.type+"/merchantDetails";
  const headerPadding={
    paddingLeft:"10rem"
  };
  
  console.log("userDetailsRoute: ",userDetailsRoute);


return (
   <Navbar  expand="lg" sticky="top">
    <Navbar.Brand href={homeRoute}>
    <img style={{float:"left"}} src={logo} width="80" height="60" className={navBranImgClass} alt="CheckMeIn logo"/>
    <h3 style={{paddingTop:"2%"}}>Welcome {loggedIn.displayName}</h3>
    </Navbar.Brand>
    <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="ml-auto">
    <Nav.Link href={homeRoute}> Home <HomeIcon style={{fill:"white"}}/></Nav.Link>
    {loggedIn.type==="merchant" && <Nav.Link href={homeRoute}> Add Store Details</Nav.Link>}
    {loggedIn.type==="merchant" && <Nav.Link href={userDetailsRoute}> In-Queue Customers</Nav.Link>}
    {loggedIn.type==="user" && <Nav.Link href={merchantDetailsRoute}> Checked-In Merchants</Nav.Link>}
    <Nav.Link href={`/${loggedIn.type}/auth/logout`} onClick={props.clearSession}>Logout <ExitToAppTwoToneIcon style={{fill:"white"}}/></Nav.Link>
    </Nav>
    </Navbar.Collapse>
    </Navbar>
  );
}

export default NavComponent;
