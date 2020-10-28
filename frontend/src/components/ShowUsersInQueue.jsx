import React, { useState, useEffect,useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import {UsersInQueueContext} from "./UsersInQueueRepo";
import {LoginContext} from "./LoginContext";
import {useHistory} from "react-router-dom";
import AddStoreMap from "./AddStoreMap";
import {Container,Row,Col,Button,Card}  from 'react-bootstrap';

export default function ShowUsersInQueue() {
    console.log("show in queue");
  const {usersInQueue, setUsersInQueue} = useContext(UsersInQueueContext);
  const [loggedIn, setLoggedIn] = useContext(LoginContext);

  return (
    <div> 
    <Header />
    <h1 style={{color:"white"}}> Users in Queue are:</h1>
    {loggedIn.status && 
    <Container fluid >
    <Row>
    {
        usersInQueue.map((user)=>(
        <Col sm={4}>
        <Card >
        <Card.Header>Name: {user.displayName}</Card.Header>
        <Card.Body>
        <Card.Text>Check In Time: {user.checkInDate}</Card.Text>
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
