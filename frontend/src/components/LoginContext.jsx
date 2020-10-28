import React, {useState,useEffect,createContext} from "react";

export const LoginContext=createContext();

export const LogInProvider = props => {
    const localState = JSON.parse(localStorage.getItem("login"));
    const [loggedIn, setLoggedIn] = useState(localState || {displayName:'',type:'',status:false});
 
    useEffect(() => {
        localStorage.setItem("login", JSON.stringify(loggedIn));
    }, [loggedIn]);



    return (
        <LoginContext.Provider value={ [loggedIn, setLoggedIn] }>
        {props.children}
        </LoginContext.Provider>
    );
};