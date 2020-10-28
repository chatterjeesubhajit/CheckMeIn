import React, { useState, useEffect,useContext } from "react";
import {Card,Button,Col}  from 'react-bootstrap';
import axios from "axios";

const AddStoreCard = (props)=>
{
console.log("called cards");
const [peopleLimit,setPeopleLimit] =useState(0);
const [storeAdded,setStoreAdded]=useState(false);
const confirmDetails= () =>{
    let storeDetails= props.storeDetails;
    storeDetails["limitOnPeople"]=peopleLimit;
    axios
    .post('/merchant/data/add', storeDetails)
    .then(response => {
      if (response.data.done) {
        console.log("response: ",response.data);
        setStoreAdded(true);
      } 
      else {
        console.log("failed to add store");
        setStoreAdded(false);
      }
  })
    .catch(err => {
      console.error(err);
    });
}
const handleLimit =(e)=>{
    console.log("limit: ",e.target.value);
    setPeopleLimit(e.target.value);
}

return (
<div>
<Card style={{marginTop:"1%"}}>
<Card.Header> Please search on map & confirm your store details</Card.Header>
<Card.Body>
<Card.Title> Name : {props.storeDetails.name} </Card.Title>
<Card.Text> Address: {props.storeDetails.address} </Card.Text>
<Card.Text> Days Open: </Card.Text>
{
props.storeDetails.opHours.map((info) => (
<Card.Text> {info} </Card.Text>
    ))
}
<Card.Text> Rating: {props.storeDetails.rating} </Card.Text>
<Card.Text> <h6>Please enter the limit of people allowed at a time in your establishment in order to maintain
        social distancing
        </h6>
<input type="text" onChange={handleLimit} placeholder="Enter Count" required/>
</Card.Text>
<Button variant="primary" onClick={confirmDetails}>Confirm</Button>
{storeAdded? <h3> Store Details saved successfully</h3>:null}
</Card.Body>
</Card>
<br />

  
</div>


)
};
export default AddStoreCard;
