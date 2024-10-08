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
import PrivateRoute from './components/PrivateRoute.jsx'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute.jsx'
import CreatePost from './pages/CreatePost.jsx'
import UpdatePost from './pages/UpdatePost.jsx'
import PostPage from './pages/PostPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  return (
    <BrowserRouter >
      <ScrollToTop/>
      <Header/>    {/* we can see header on each page , so we we write it outside the rotes and inside the browserrouter */}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>

        
        <Route path="/projects" element={<Projects/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/post/:postSlug" element={<PostPage/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
