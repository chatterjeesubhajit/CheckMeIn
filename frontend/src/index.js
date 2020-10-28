import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './components/CheckMeIn.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {LogInProvider} from "./components/LoginContext";



ReactDOM.render(<LogInProvider><App/></LogInProvider>, document.getElementById("root"));