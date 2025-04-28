import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();
export default function UserContextProvider({ children }){
    const [userLogin, setUserLogin] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            setUserLogin(token);
        }
    }, []);

    return (
        <UserContext.Provider value={{ userLogin, setUserLogin }}>
            {children}
        </UserContext.Provider>
    );
}