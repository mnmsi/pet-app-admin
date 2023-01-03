import React from "react";
import {Route, Routes} from "react-router-dom";
import {useLocation, useNavigate} from "react-router";
import Dashboard from "../pages/dashboard";
import Species from "../pages/species";
import EditSpecies from "../pages/species/edit";
import CreateSpecies from "../pages/species/create";

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
            <Route path="/" element={<Dashboard/>}/>
            {/*species*/}
            <Route path="/species" element={<Species/>}/>
            <Route path="/species/edit" element={<EditSpecies/>}/>
            <Route path="/species/create" element={<CreateSpecies/>}/>
            <Route path="*" element=""/>
        </Routes>
    );
};

export default PrivateRoute;
