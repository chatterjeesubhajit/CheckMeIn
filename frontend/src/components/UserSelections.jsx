import React, {useState,createContext,useMemo,useEffect} from "react";

export const UserSelectionsContext=createContext();

export const UserSelectionsProvider = props => {
    const localState = JSON.parse(sessionStorage.getItem("userSelection"));

    const [userSelection, setUserSelection] = useState(localState || []);
    
    useEffect(() => {
        sessionStorage.setItem("userSelection", JSON.stringify(userSelection));
    }, [userSelection]);

    const value=useMemo(()=>({userSelection, setUserSelection}));

    return (
        <UserSelectionsContext.Provider value={value}>
        {props.children}
        </UserSelectionsContext.Provider>
    );
};
