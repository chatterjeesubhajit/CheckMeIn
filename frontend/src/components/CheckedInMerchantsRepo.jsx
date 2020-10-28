import React, {useState,createContext,useMemo,useEffect} from "react";

export const CheckedInMerchantsContext=createContext();

export const CheckedInMerchantsProvider = props => {
    const localState = JSON.parse(sessionStorage.getItem("checkedInMerchants"));

    const [checkedInMerchants, setCheckedInMerchants] = useState(localState || []);
    
    useEffect(() => {
        sessionStorage.setItem("checkedInMerchants", JSON.stringify(checkedInMerchants));
    }, [checkedInMerchants]);

    const value=useMemo(()=>({checkedInMerchants, setCheckedInMerchants}));

    return (
        <CheckedInMerchantsContext.Provider value={value}>
        {props.children}
        </CheckedInMerchantsContext.Provider>
    );
};


export const AllMerchantsContext=createContext();

export const AllMerchantsProvider = props => {
    const localState = JSON.parse(localStorage.getItem("AllMerchants"));

    const [allMerchants, setAllMerchants] = useState(localState || []);
    
    useEffect(() => {
        localStorage.setItem("AllMerchants", JSON.stringify(allMerchants));
    }, [allMerchants]);

    const value=useMemo(()=>({allMerchants, setAllMerchants}));

    return (
        <AllMerchantsContext.Provider value={value}>
        {props.children}
        </AllMerchantsContext.Provider>
    );
};