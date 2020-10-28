import React,{useState,useEffect,useContext} from "react";
import {CheckedInMerchantsContext,AllMerchantsContext} from "./CheckedInMerchantsRepo";
import {UserSelectionsContext}  from "./UserSelections";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import {Container,Row,Col}  from 'react-bootstrap';

import { formatRelative } from "date-fns";
import RoomIcon from '@material-ui/icons/Room';
import ExploreOffIcon from '@material-ui/icons/ExploreOff';
import "@reach/combobox/styles.css";
import compass from "../compass.jpg"

const libraries = ["places"];
const mapContainerStyle = {
  height: "80vh",
  // width: "20vw",
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
export default function FindStoresMap() {
const [center,setCenter]=useState({lat: 33.0061, lng: -96.7026});
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:process.env.REACT_APP_GOOGLE_KEY,
    libraries,
  });
  const {allMerchants, setAllMerchants} = useContext(AllMerchantsContext);
  const [marker, setMarker] = useState(    {
    lat:"",lng:"",time:""
  });
  const [infoWindow,setInfoWindow]=useState();
  const {userSelection, setUserSelection} = useContext(UserSelectionsContext);
  
    

  useEffect(() => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
        setCenter({lat:position.coords.latitude,lng:position.coords.longitude});
      });
      
    }
    
}, []);




function Locate({ panTo }) {
    return (
      <button
        className="locate"
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => null
          );
        }}
      >
        <img src={compass} width="60" height="60"  alt="compass" />
      </button>
    );
  }
  
 

  const onMapClick = React.useCallback((e) => {
      console.log("map click :",e);
    setMarker(
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      }
    );
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(17);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";
  const onLoad = infoWindow => {
    console.log('infoWindow: ', infoWindow)
  }
  const showInfo =(merchant,e)=>{
    console.log("merchant clicked",merchant);
    if(infoWindow === undefined)
    setInfoWindow(merchant);
    else setInfoWindow(undefined)    

  }
  const closeInfoWindow =()=>{
    setInfoWindow(undefined);
  }

  return (
    <div className="findStores">
    <Locate panTo={panTo}/>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {infoWindow !== undefined? 
          <InfoWindow onCloseClick={closeInfoWindow} position={{ lat: infoWindow.lat, lng: infoWindow.lng }}>
              <div>
                <p><b>{infoWindow.companyName}</b></p>
                <p>{infoWindow.streetAddress}</p>
                <a href={infoWindow.url}>View on Google Maps</a>  
              </div>
          </InfoWindow>
            :null}
        {userSelection.length>0?        
        userSelection.map((merchant) => (
          <div>
          <Marker  key={`${merchant.lat}-${merchant.lng}`} onClick={(e)=>showInfo(merchant,e)} position={{ lat: merchant.lat, lng: merchant.lng }}/>
          </div>
        ))                 
          :null
        }

        
      </GoogleMap>
    
    </div>
   
 
  );
}

