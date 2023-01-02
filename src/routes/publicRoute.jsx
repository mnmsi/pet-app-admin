import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";

const PublicRoute = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element="" />
    </Routes>
  );
};

export default PublicRoute;
