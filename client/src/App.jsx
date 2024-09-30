import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Projects from "./pages/Projects.jsx"
import SignIn from "./pages/SignIn.jsx"
import SignUp from "./pages/SignUp.jsx"
import Header from "./components/Header.jsx"
import Footer from './pages/Footer.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Header/>    {/* we can see header on each page , so we we write it outside the rotes and inside the browserrouter */}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
