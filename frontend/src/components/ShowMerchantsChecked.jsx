import React, { useState, useEffect,useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import {CheckedInMerchantsContext} from "./CheckedInMerchantsRepo";
import {LoginContext} from "./LoginContext";
import {useHistory} from "react-router-dom";
import AddStoreMap from "./AddStoreMap";
import {Container,Row,Col,Button,Card}  from 'react-bootstrap';

export default function ShowMerchantsChecked() {
    console.log("show in queue");
    const {checkedInMerchants, setCheckedInMerchants} = useContext(CheckedInMerchantsContext);
  const [loggedIn, setLoggedIn] = useContext(LoginContext);

  return (
    <div> 
    <Header />
    <h1 style={{color:"white"}}> Merchants that you have checked in historically are:</h1>
    {loggedIn.status && 
    <Container fluid >
    <Row>
    {
      checkedInMerchants.map((merchant)=>(
        <Col sm={4}>
        <Card>
        <Card.Header>Name: {merchant.companyName}</Card.Header>
        <Card.Body>
        <Card.Text>Check In Time: {merchant.checkInTime}</Card.Text>
        <Card.Text>Check In Position: {merchant.position}</Card.Text>
        </Card.Body>
        </Card>
        </Col>
        )

        )  
    }
    </Row>
    </Container>}
    </div>

  );
}
