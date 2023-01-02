import React from "react";
import { Route, Routes } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import Dashboard from "../pages/dashboard";
const PrivateRoute = () => {
  const location = useLocation();
  const history = useNavigate();
  let navigate = null;
  if (location.pathname == "/login") {
    navigate = history("/");
  }
  return (
    <Routes>
      {navigate}
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element="" />
    </Routes>
  );
};

export default PrivateRoute;
