import React ,{useContext} from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UserHome from "./components/UserHome";
import MerchantHome from "./components/MerchantHome";
import SignUp  from "./components/SignUp";
// import ZoomView from "./components/ZoomView";
import history from "./history";
import {UsersInQueueProvider} from "./components/UsersInQueueRepo";
import {LoginContext} from "./components/LoginContext";
import {CheckedInMerchantsProvider,AllMerchantsProvider} from "./components/CheckedInMerchantsRepo";
import {UserSelectionsProvider} from "./components/UserSelections";
import ShowUsersInQueue from "./components/ShowUsersInQueue";
import ShowMerchantsChecked from "./components/ShowMerchantsChecked";

function App() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  return (
    <div>
    <UsersInQueueProvider>
    <AllMerchantsProvider>
    <CheckedInMerchantsProvider>    
    <UserSelectionsProvider>
    <Router>
    {!loggedIn.status && <Route path="/" exact component={SignUp} />}
    {loggedIn.status && loggedIn.type==="user" && <Route path="/" exact component={UserHome} />}
    {loggedIn.status && loggedIn.type==="merchant" && <Route path="/" exact component={MerchantHome} />}
      <Route path="/user/merchantDetails" exact component={ShowMerchantsChecked} />
      <Route path="/user/home/:userName" exact component={UserHome} />
      <Route path="/merchant/userDetails" exact component={ShowUsersInQueue} />
      <Route path="/merchant/home/:userName" exact component={MerchantHome} />
      
    </Router>  
    </UserSelectionsProvider>
    </CheckedInMerchantsProvider>
    </AllMerchantsProvider>
    </UsersInQueueProvider>
    </div>
  );
}

export default App;
