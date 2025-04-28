import React from "react";
import Login from './../Login/Login';
import { Navigate } from "react-router-dom";

export default function ProtectedRouting(props){
    if(localStorage.getItem('userToken')!==null){
        return props.children
    }
    else{
        return <Navigate to='/login'/>
    }
}