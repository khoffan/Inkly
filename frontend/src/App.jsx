import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/NavbarComponents/Nav.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import CreatePost from "./pages/Posts/CreatePost.jsx";
import Profile from "./pages/userProfile/Profile.jsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.jsx";
import EditProfile from "./pages/userProfile/EditProfile.jsx";
import Blogspage from "./pages/Posts/Blogspage.jsx";
import BlogDetail from "./pages/Posts/BlogDetail.jsx";

import BlogUpdate from "./components/BlogComponents/BlogUpdate.jsx";


const element = (
  <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute redirectPath="/">
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRoute redirectPath="/">
              <Register />
            </ProtectedRoute>
          }
        />
        <Route path="/blog/:id" element={<Blogspage />} />
        <Route path="/create-blog/:id" element={<CreatePost />} />
        <Route path="/user/profile/" element={<Profile />} />
        <Route path="/user/editprofile/:id" element={<EditProfile />} />
        <Route path="/blog/detail/:id" element={<BlogDetail />} />
        <Route path="/update-blog/:id" element={<BlogUpdate />} />
      </Routes>
)


function App() {
  return (
      <>
        <Nav />
        {element}
      </>
      
  );
}

export default App;
