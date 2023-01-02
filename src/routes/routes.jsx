import React from "react";
import PublicRoute from "./publicRoute";
import PrivateRoute from "./privateRoute";
const Routes = ({ auth }) => {
  let renderAuth = <PublicRoute />;
  if (auth) {
    renderAuth = <PrivateRoute />;
  }
  return <>{renderAuth}</>;
};

export default Routes;
