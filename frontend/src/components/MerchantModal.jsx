import React,{useState,useEffect,useContext} from "react";

import {Container,Row,Col,Button,Card,Modal}  from 'react-bootstrap';

import axios from "axios";
import {CheckedInMerchantsContext,AllMerchantsContext} from "./CheckedInMerchantsRepo";
import {UserSelectionsContext}  from "./UserSelections";
import FindStoresMap from "./FindStoresMap";
import { Controller } from "react-hook-form";

export default function MerchantModal(props) {

  const [merchant,setMerchant]=useState(props.merchant);
  const handleClose = () =>{
    props.handleClose();
    setMerchant({});
  } 


return (
  <div>
{(props.merchant !==undefined)? 
 <Modal 
      show={props.zoom}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        >
        <Modal.Header closeButton>
          <Modal.Title>{props.merchant.companyName}
          <br/>
          <span>{props.merchant.streetAddress}</span>   
          </Modal.Title>       
        </Modal.Header>
        
        
        <Modal.Body>
        
        <ul>
          <li>Limits on persons allowed at a time: {props.merchant.limitOnPeople}</li>
          <li>Number of users already in queue: {props.merchant.numUsersInQueue}</li>
          {props.merchant.opHours.length>0?        
          <li> Operating Hours:
          <ul style={{paddingLeft:"5%"}}>
          {props.merchant.opHours.map((opHour)=>(
            <li>{opHour}</li>
          ))}
          </ul>
          </li>          
          :null
          }
          <li>Rating: {props.merchant.rating["$numberDecimal"]}</li>
          <li><a href={props.merchant.website}>Check out Website</a></li>
          <li><a href={props.merchant.url}>Find on maps</a></li>
          <li>Category: {props.merchant.types[0]}</li>
        </ul>
        </Modal.Body>
        {/* <Modal.Footer>   
        
        </Modal.Footer> */}
        
    </Modal>

:null}
</div>
)
}

