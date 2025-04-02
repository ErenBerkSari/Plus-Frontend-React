import React from "react";
import Login from "../components/Login";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Register from "../components/Register";

function RouterConfig() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default RouterConfig;
