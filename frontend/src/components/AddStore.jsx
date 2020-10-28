import React, { useState, useEffect,useContext } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import AddStoreMap from "./AddStoreMap";
import {UsersInQueueContext} from "./UsersInQueueRepo";
import {LoginContext} from "./LoginContext";
import {useHistory} from "react-router-dom";


const AddStore = () =>{

return (
    <AddStoreMap />
)

}
export default AddStore;