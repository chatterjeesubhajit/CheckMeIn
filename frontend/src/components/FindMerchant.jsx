import React,{useState,useEffect,useContext} from "react";
// import {BiExpand} from "react-icons/bi";
import { BiExpand } from 'react-icons/bi';
import {Container,Row,Col,Button,Card}  from 'react-bootstrap';
import Places from "./PlaceTypes";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from "axios";
import {CheckedInMerchantsContext,AllMerchantsContext} from "./CheckedInMerchantsRepo";
import {UserSelectionsContext}  from "./UserSelections";
import FindStoresMap from "./FindStoresMap";
import { Controller } from "react-hook-form";
import MerchantModal from "./MerchantModal";
import { MdClear } from "react-icons/md";
import sockIO from 'socket.io-client';

export default function FindMerchant() {
  
const {checkedInMerchants, setCheckedInMerchants} = useContext(CheckedInMerchantsContext);
const {allMerchants, setAllMerchants} = useContext(AllMerchantsContext);
const {userSelection, setUserSelection} = useContext(UserSelectionsContext);
const [value, setValue] = useState("Search Categories");
const [inputValue, setInputValue] = useState('');
const [miles, setMiles] = React.useState(50*1609);
const [center,setCenter]=useState({lat: 33.0061, lng: -96.7026});
const [merchantsFound,setMerchantsFound]=useState(allMerchants);
const [checkIn,setCheckIn]=useState({placeId:"",position:0});
const [checkOut,setCheckOut]=useState({placeId:"",position:0});
const [modalZoom,setModalZoom]=useState(false);
const [merchantZoom,setMerchantZoom]=useState();
const [socketUpdate,setSocketUpdate]=useState();
// var socketIO;
// useEffect(()=>{
  var backEndPort="http://localhost:5000";
  console.log("environment :",process.env.NODE_ENV);
  console.log("google key:",process.env.REACT_APP_GOOGLE_KEY);
  
  var socketIO;
  if (process.env.NODE_ENV === 'production') {
    socketIO=sockIO.connect();
  } else {
    socketIO=sockIO.connect(backEndPort);
  };
  // console.log("socket is :",socketIO);  



  socketIO.on('connect', function() {
    // Connected, let's sign-up for to receive messages for this room
    socketIO.emit('room', "checkInQueue");
 });



useEffect(()=>{
  socketIO.on('message', function(data) {
    console.log('Incoming message:',data);
    setSocketUpdate(data);
  });  
},[])

useEffect(()=>{
    if(checkedInMerchants !== undefined && socketUpdate !==undefined && checkedInMerchants.length>0){ 
      console.log("checked in merchants before: ",checkedInMerchants);
    setCheckedInMerchants(prev=> prev.map((checkedInOnes)=>{
      if(checkedInOnes.placeId === socketUpdate.placeId){
        console.log("id matched");
        if ((socketUpdate.position< checkedInOnes.position) && checkedInOnes.position>1){
          console.log("position less");
          return {...checkedInOnes,["position"]:checkedInOnes.position-1};
        }
      }
       return checkedInOnes;
    }));
    console.log("checked in merchants after: ",checkedInMerchants);

  }
},[socketUpdate])

    




useEffect(() => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
        setCenter({lat:position.coords.latitude,lng:position.coords.longitude});
      });
      
    }
    
}, []);

useEffect(()=>{ 
  setMerchantsFound(allMerchants);
},[allMerchants])

useEffect(()=>{

  if(value!=="" && value !==null && value !=="Search Categories")
  {  
    console.log("select category: ",value);
    setMerchantsFound(allMerchants.filter(merch=>merch.types.includes(value)&& merch.distanceFromCenter<=miles));    
    setUserSelection(allMerchants.filter(merch=>merch.types.includes(value)&& merch.distanceFromCenter<=miles));    
  }
else 
{
  if(value ===null || value===""){
    setValue("Search Categories");
  }
  setMerchantsFound(allMerchants.filter(merch=> merch.distanceFromCenter<=miles));  
  setUserSelection([]); 
}

},[value,miles])


const handleSubmit = (event) => {    
    event.preventDefault();
    
    if(value === null || value ===""){
      setValue("Search Categories");      
    }
    else {
      setUserSelection(allMerchants.filter(merch=>merch.types.includes(value)&& merch.distanceFromCenter<=miles)); 
    }
    
    event.target.reset();    
}
const handleSelect =(event)=>{
    console.log(event.target.value);
    if(event.target.value!==""){
    setMiles(event.target.value*1609);
     
    }
    else
    setMiles(50*1609);
}


const handleCheckinAndOut = (event)=>{
  event.preventDefault();
    if(checkIn.placeId !==""){
    console.log("checkin value:",checkIn);
    // let foundMerchant=;
    // console.log("check in merchant is :" ,foundMerchant);
    setCheckedInMerchants(prevMerchants => {
      return [...prevMerchants, {...merchantsFound.filter(m=>m.placeId === checkIn.placeId)[0],position:checkIn.position}];
    });
  
    axios
      .post('/user/data/checkin', {checkIn:checkIn})
      .then(response => {
        console.log(response.data);
        setCheckIn({placeId:"",position:0});        
    })
      .catch(err => {
        console.error(err);
      });
      
    }
    else if(checkOut.placedId !=="") {
      console.log("checkout value:",checkOut);
      setCheckedInMerchants(prevMerchants=>prevMerchants.filter(merchant=>merchant.placeId !== checkOut.placeId));
      axios
      .post('/user/data/checkout', {checkOut:checkOut})
      .then(response => {
        console.log(response.data);
        setCheckOut({placeId:"",position:0});                    
    })
      .catch(err => {
        console.error(err);
      });    
    }
    event.target.reset();    
    
    
}

const handleZoom =(merchant,e) =>{
  setMerchantZoom(merchant);
  setModalZoom(true);
}
const handleCloseModal=()=>{
  setModalZoom(false);  
}

return (
<Row style={{marginLeft:"1%"}} >
<MerchantModal zoom={modalZoom} handleClose={handleCloseModal} merchant={merchantZoom}/>
<Col sm={8}>
<form onSubmit={handleSubmit}>
<Row style={{paddingTop:"1%"}}>
<h5 style={{color:"white"}}> Search for types of places from the list below</h5>   
</Row>
<Row>
      <Col sm={5} id="categorySelector">
      <Autocomplete      
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);      
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        clearOnEscape
        clearOnBlur
        freeSolo
        id="free-solo-demo1"
        label="Merchant Categories..."
        options={Places}
        style={{ width: 300}}
        renderInput={(params) => <TextField {...params} style={{background:"white"}} variant="outlined" />}
      />
      </Col>
      <Col sm={3} id="milesSelector">       
        <select  id="miles" name="miles" onChange={handleSelect}>
        <option value="" selected> Within Radius (miles)</option>
        <option value="5">5 miles</option>
        <option value="10">10 miles</option>
        <option value="20">20 miles</option>
        <option value="50">50 miles</option>
        </select>        
        <button type="submit">X</button>
        </Col>    

    
</Row>
</form>
<Row>
<form onSubmit={handleCheckinAndOut}>
<Row className="merchantsDisplay" style={{margin:"0",padding:"0"}}>
  
    {merchantsFound.length >0 ? merchantsFound.map((merchant) => (
        <div className="col-sm-3 merchantListing">        
        <Card>
            <Card.Header>{merchant.companyName} 
             <BiExpand onClick={(e)=>handleZoom(merchant,e)}/>
            </Card.Header>
            <Card.Body >
            {
               (checkedInMerchants.length>0 && checkedInMerchants.map(checked=>checked.placeId).includes(merchant.placeId))?
               <div >
                <p style={{fontSize:"large",color:"green"}}>Checked In!</p>
                <p><b>Position: # {checkedInMerchants.filter(m=>m.placeId === merchant.placeId)[0].position}                
                 / Capacity: {merchant.limitOnPeople}</b></p>
                 <Button size="sm" type="submit"  onClick={e => setCheckOut({placeId:merchant.placeId,position:checkedInMerchants.filter(m=>m.placeId === merchant.placeId)[0].position})}  variant="warning" name="CheckOut" value="checkout">Check out</Button> 
                </div>:
               (merchant.limitOnPeople > merchant.numUsersInQueue)? 
              
              <Card.Text>             
                 <p style={{color:"green"}} > 
                 Available to check-in. <br></br>
                 <Button size="sm" type="submit"  onClick={e => setCheckIn({placeId:merchant.placeId,position:merchant.numUsersInQueue+1})}  variant="success" name="CheckIn" value="checkin">Check In</Button> 
                 </p>
             </Card.Text>
             :<Card.Text>
             <p style={{color:"red"}}><b>Queue is full !</b>  {"  "}           
             <Button  size="sm"  type="submit" onClick={e => setCheckIn({placeId:merchant.placeId,position:merchant.numUsersInQueue+1})} variant="danger" name="CheckIn" value="queue">Add to Queue</Button> 
             </p>            
             </Card.Text>             
             }
                         

            <Card.Text> <p>Address: {merchant.streetAddress} </p>
             Contact: {merchant.phone}            
            { } <a href={merchant.url}>Map Url</a> </Card.Text>
             </Card.Body>
        </Card>
        </div>
        
    )):null}   

</Row>
</form> 
</Row>
</Col>
<Col sm={4}>
<FindStoresMap style={{marginRight:"1%"}}/>
</Col>
</Row>

)
}

