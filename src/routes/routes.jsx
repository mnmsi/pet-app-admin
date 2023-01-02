import React, { useState } from "react";
import PublicRoute from "./publicRoute";
import PrivateRoute from "./privateRoute";
import Sidebar from "../scenes/global/Sidebar";
// import Topbar from "../scenes/global/Topbar";
const Routes = ({ auth }) => {
  //   const [isSidebar, setIsSidebar] = useState(true);
  let [isAuth, setAuth] = useState(false);
  let renderAuth = (
    <main className="content">
      {/* <Topbar setIsSidebar={setIsSidebar} /> */}
      <PublicRoute />
    </main>
  );
  if (isAuth) {
    renderAuth = (
      <main className="content">
        {/* <Topbar setIsSidebar={setIsSidebar} /> */}
        <Sidebar isSidebar={true} />
        <PrivateRoute />
      </main>
    );
  }
  return <>{renderAuth}</>;
};

export default Routes;
