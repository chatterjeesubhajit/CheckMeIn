import React, {useState,createContext,useMemo,useEffect} from "react";

export const UsersInQueueContext=createContext();

export const UsersInQueueProvider = props => {
    const localState = JSON.parse(sessionStorage.getItem("usersInQueue"));

    const [usersInQueue, setUsersInQueue] = useState(localState || []);
    
    useEffect(() => {
        sessionStorage.setItem("usersInQueue", JSON.stringify(usersInQueue));
    }, [usersInQueue]);

    const value=useMemo(()=>({usersInQueue, setUsersInQueue}));

    return (
        <UsersInQueueContext.Provider value={value}>
        {props.children}
        </UsersInQueueContext.Provider>
    );
};