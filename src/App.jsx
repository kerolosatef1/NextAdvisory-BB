import { useState } from 'react'
import './App.css'
import Home from './components/Home/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Notfound from './components/Notfound/Notfound';
import About from './components/About/About';
import Features from './components/Features/Features';
import Servic from './components/Servic/Servic';
import ContactUs from './components/ContactUs/ContactUs';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Slidebar from './components/Slidebar/Slidebar';
import Proffesors from './components/Proffesors/Proffesors';
import Teachingassistant from './components/TeachingAssisstant/TeachingAssisstant';
import Halls from './components/Halls/Halls';
import GetCourses from './components/Courses/Courses';
import PostProfessors from './components/Postprofessor/Postprofessor';
import CourseProfessors from './components/Postprofessor/Postprofessor';
import LoadingScreen from './components/Loading/Loading';
import UserContextProvider from './components/UserContext/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRouting from './components/ProtectRouting/ProtectRouting';
import { Toaster } from 'react-hot-toast';
import Etnerlife from './components/Etnerlife/Etnerlife';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

let query=new QueryClient({
  defaultOptions : {
    queries: {
      
    },
  },
}); 

function App() {
  let x= createBrowserRouter([
    {path:'',element:<Layout/>,children:[
      {index:true,element:<ProtectedRouting><Home/></ProtectedRouting>},
      {path:'about',element:<ProtectedRouting><About/></ProtectedRouting>},
      {path:'features',element:<ProtectedRouting><Features/></ProtectedRouting>},
      {path:'servic',element:<ProtectedRouting><Servic/></ProtectedRouting>},
      {path:'contactus',element:<ProtectedRouting><ContactUs/></ProtectedRouting>}, 
      {path:'slidebar',element:<ProtectedRouting><Slidebar/></ProtectedRouting>},
      {path:'proffesors',element:<ProtectedRouting><Proffesors/></ProtectedRouting>},
      {path:'teachingassistant',element:<ProtectedRouting><Teachingassistant/></ProtectedRouting>},
      {path:'entery',element:<ProtectedRouting><Etnerlife/></ProtectedRouting>},
      {path:'halls',element:<ProtectedRouting><Halls/></ProtectedRouting>},
      {path:"courses",element:<ProtectedRouting><GetCourses/></ProtectedRouting>},
      {path:'postprofessor',element:<ProtectedRouting><CourseProfessors/></ProtectedRouting>},
      {path:'loading',element:<ProtectedRouting><LoadingScreen/></ProtectedRouting>},
      {path:'login',element:<Login/>},
      {path:'register',element:<Register/>},
      {path:'*',element:<Notfound/>}
    ]}
  ])
  
 

  return (
    <>
     <QueryClientProvider client={query}>
    <UserContextProvider>
   <RouterProvider router={x}></RouterProvider>
  <ReactQueryDevtools initialIsOpen={false}/>
   <Toaster/>
   </UserContextProvider>
   </QueryClientProvider>
    </>
  )
}

export default App
