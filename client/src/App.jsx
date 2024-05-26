import { useEffect, useState } from 'react'
import './App.css'
import api from './api/api';
import axios from "axios";
import SlackAuth from './components/SlackAuth';

function App() {

  const [user,setUser]=useState(null);

  useEffect(()=>
  {
    const fetchUser=async ()=>
    {
      try
      {
        const response=await axios.get('http://localhost:3000/login/success',{
          withCredentials: true
        });
        console.log(response);

        setUser(response.data.user);
      }
      catch(err)
      {
        console.log(err);
      }
    }

    fetchUser();
  },[]);

  return (
    <>
    {!user && <a href="http://localhost:3000/auth/google"><button >Log in to Google</button></a>}
    <a href="http://localhost:3000/logout"><button>Logout</button></a>
    {user?.displayName}
    <SlackAuth/>
    </>
  )
}

export default App
