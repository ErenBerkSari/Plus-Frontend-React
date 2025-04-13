import React from "react";
import Login from "../components/Login";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";

function RouterConfig() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default RouterConfig;
