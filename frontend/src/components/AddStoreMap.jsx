import React,{useState,useEffect} from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import {Container,Row,Col}  from 'react-bootstrap';
import AddStoreCard from "./AddStoreCard";


import { formatRelative } from "date-fns";
import RoomIcon from '@material-ui/icons/Room';
import ExploreOffIcon from '@material-ui/icons/ExploreOff';
import "@reach/combobox/styles.css";
import compass from "../compass.jpg"

const libraries = ["places"];
const mapContainerStyle = {
  height: "50vh",
  width: "50vw",
};
const options = {
//   styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
// const center = {
//   lat:33.0061548,
//   lng: -96.70262939999999,
// };


export default function AddStoreMap() {
const [center,setCenter]=useState({lat: 33.0061, lng: -96.7026});
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:process.env.REACT_APP_GOOGLE_KEY,
    libraries,
  });
  const [marker, setMarker] = useState(  {
    lat:"",
    lng:"",
    time:"",
  });
    
  const [storeDetails,setStoreDetails]=useState({
   name:"",
   address:"",
   zip:"",
   placeId:"",
   icon:"",
   phone:"",
   types:[],
   opHours:[],
   rating:"",
   lat:"",
   lng:"",
   website:"",
   url:""
  });

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
  
  function Search({ panTo }) {
    const {
      ready,
      value,
      suggestions: { status, data },
      suggestions,
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        location: { lat: () => center.lat, lng: () => center.lng},
        radius: 100 * 1000,
      },
    });
   
    
    const handleInput = (e) => {
      setValue(e.target.value);
    };
  
    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();
  
      try {
        const details = await  getDetails(suggestions.data[0]);
        console.log("Details: ",details);
        const results = await getGeocode({ address });
        console.log("results: ",results[0]);
        const { lat, lng } = await getLatLng(results[0]);
        console.log("lat,lng :",lat,"," ,lng);
        setStoreDetails({
            name:details.name,
            address:details.formatted_address,
            zip:details.address_components[details.address_components.length-1].short_name,
            placeId:details.place_id,
            icon:details.icon,
            phone:details.formatted_phone_number,
            types:details.types,
            opHours:details.opening_hours.weekday_text,
            rating:details.rating,
            lat:lat,
            lng:lng,
            website:details.website,
            url:details.url
        });
        console.log("storeDetails now: ",storeDetails);
        panTo({ lat, lng });

      } catch (error) {
        console.log("😱 Error: ", error);
      }
    };
  
    return (
      <div className="search">
        <Combobox onSelect={handleSelect}>
          <ComboboxInput
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Search your location"
        
          />
          <ComboboxPopover>
            <ComboboxList>
              {status === "OK" &&
                data.map(({ id, description}) => (
                  <ComboboxOption key={id} value={description}/>
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
      </div>
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

  return (
    <Container fluid style={{paddingTop:"1%"}}>
    <Row>
        <Col>
        <div className="addstoreMap">
    <Container fluid>
    <Row>
    <Col sm={1}>
      <Locate panTo={panTo}/>
    </Col>
    <Col>
      <Search panTo={panTo}/>
    </Col>
    </Row>
    <Row>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
    {marker.lat !== ""?
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {            
              setMarker( {  lat:"",lng:"",time:""});              
              

            }}
          /> :null
        }
        
      </GoogleMap>
    </Row>
      </Container>
    </div>
        </Col>
        <Col>
        <AddStoreCard storeDetails={storeDetails} />
        </Col>
    </Row>
    </Container>
 
  );
}

