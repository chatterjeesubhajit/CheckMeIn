import React , { useState,useContext } from "react";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {LoginContext} from "./LoginContext";
function LoginTab() {
const {register,watch, errors,handleSubmit}=useForm();
let history = useHistory();
const [loginFail,setLoginFail] = useState(false);
const [userType,setUserType] = useState("");
const [loggedIn, setLoggedIn] = useContext(LoginContext);
console.log("login tab");
const userTypeChoice =(e)=> {
  console.log(e.currentTarget.value);
  setUserType(e.currentTarget.value);
}

const onSubmit = (data,e) => {
  if(userType=="User"){
    axios
      .post('/user/auth/login', data)
      .then(response => {
        if (response.data.authenticate) {
          console.log("response: ",response.data);
          setLoggedIn({displayName:response.data.displayName,type:response.data.type,status:response.data.authenticate});

                history.push(`/user/home/${response.data.displayName}`);
        } 
        else {
          setLoginFail(true);
        }
    })
      .catch(err => {
        console.error(err);
      });
    }
    else
    {
      axios
      .post('/merchant/auth/login', data)
      .then(response => {
        if (response.data.authenticate) {
          console.log("response: ",response.data);  
               setLoggedIn({displayName:response.data.displayName,type:response.data.type,status:response.data.authenticate});
                history.push(`/merchant/home/${response.data.displayName}`);
        } 
        else {
          setLoginFail(true);
        }
    })
      .catch(err => {
        console.error(err);
      });
    }

      e.preventDefault();
      e.target.reset();    
    
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <div className="card-body" style={{color:"white"}}>
        <h5>Please select your catgeory:</h5>
       <label>
        User {"  "}
       <input type="radio" id="User" name="userType" value="User" ref={register} onClick={userTypeChoice} required />
       </label>
       <label style={{paddingLeft:"1%"}}>
        Merchant {"  "}
        <input type="radio" id="Merchant" name="userType" value="Merchant" ref={register} onClick={userTypeChoice} />
        </label>
        </div>
        </div>

        <div className="form-group">
          <input type="email" className="form-control" placeholder="Email" name="username" ref={register}/>
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" className="form-control" name="password" ref={register} required/>
        </div>
        <button type="submit" className="btn btn-dark">
          Login
        </button>
        {loginFail && <p>Failed to login, please try again</p>}
      </form>
    </div>
  );
}

export default LoginTab;
