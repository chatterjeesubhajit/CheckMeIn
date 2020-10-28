import React , { useState,useContext } from "react";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {LoginContext} from "./LoginContext";
function Register() {
const {register,watch, errors,handleSubmit}=useForm();
let history = useHistory();
const [nameTaken,setNameTaken] = useState(false);
const [userType,setUserType] = useState("");
const [loggedIn, setLoggedIn] = useContext(LoginContext);
console.log("register");
const userTypeChoice =(e)=> {
  console.log(e.currentTarget.value);
  setUserType(e.currentTarget.value);
}

const onSubmit = (data,e) => {
  if(userType==="User"){
    axios
      .post('/user/auth/register', data)
      .then(response => {
        if (response.data.status) {
            console.log('successful signup')
                setLoggedIn({displayName:response.data.displayName,type:response.data.type,status:response.data.status});
                history.push(`/user/home/${response.data.displayName}`);
        } else {
            setNameTaken(true);
        }
    })
      .catch(err => {
        console.error(err);
      });
  }
  else
  {
        axios
      .post('/merchant/auth/register', data)
      .then(response => {
        if (response.data.status) {
            console.log('successful signup')
            console.log("response: ", response.data);
            setLoggedIn({displayName:response.data.displayName,type:response.data.type,status:response.data.status});
            history.push(`/merchant/home/${response.data.displayName}`);
        } else {
            setNameTaken(true);
        }
    })
      .catch(err => {
        console.error(err);
      });
  }
    console.log(data);
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
       <label  style={{paddingLeft:"1%"}}>
  
        Merchant {"  "}
        <input type="radio" id="Merchant" name="userType" value="Merchant" ref={register} onClick={userTypeChoice} />
        </label>
        </div>
        </div>
     
      <div className="form-group">
          <input type="text" className="form-control" placeholder= {`${userType} First Name`} name="firstname" ref={register} required/>
        </div>
        <div className="form-group">
          <input type="text" className="form-control" placeholder= {`${userType} Last Name`} name="lastname" ref={register} required/>
        </div>
      

        <div className="form-group">
          <input type="email" className="form-control" placeholder="Email" name="username" ref={register}/>
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" className="form-control" name="password" ref={register({pattern:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/})} required/>
          {errors.password && <p>Minimum eight characters, at least one letter and one number and a special character</p>}
        </div>
        <div className="form-group">
        <input type="password" className="form-control" name="cnfPassword" ref={register({validate: (value) => value === watch('password')})} placeholder="Confirm Password" required/>        
        {errors.cnfPassword && <p>Passwords don't match</p>}
        </div>
        
        <button type="submit" className="btn btn-dark">
          Register
        </button>
        {nameTaken && <p> Sorry, email id already exists!</p>}
      </form>
    </div>
  );
}

export default Register;
