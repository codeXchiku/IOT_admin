import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
const Users = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mobno = urlParams.get("mobno");
    localStorage.setItem("usermob", mobno);
    const navigate = useNavigate();
      
    useEffect(()=>{
      navigate('/users/userpage');
      // eslint-disable-next-line
   },[])
    
  return (
    <>hi</>
  )
}

export default Users;