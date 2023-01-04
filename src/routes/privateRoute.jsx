import React from "react";
import {Route, Routes} from "react-router-dom";
import {useLocation, useNavigate} from "react-router";
import Dashboard from "../pages/dashboard";
import Species from "../pages/species";
import EditSpecies from "../pages/species/edit";
import CreateSpecies from "../pages/species/create";
import PetIdType from "../pages/pet-id-type";
import CreatePetIdType from "../pages/pet-id-type/create";
import UpdatePetIdType from "../pages/pet-id-type/edit";
import PetType from "../pages/pet-type";
import CreatePetType from "../pages/pet-id-type/create";
import UserPets from "../pages/user-pets";

function UpdatePetType() {
    return null;
}

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
            {/*users*/}
            <Route path="/user-pets" element={<UserPets/>}/>
            {/*species*/}
            <Route path="/species" element={<Species/>}/>
            <Route path="/species/edit" element={<EditSpecies/>}/>
            <Route path="/species/create" element={<CreateSpecies/>}/>
            {/*pet id type*/}
            <Route path="/petidtype" element={<PetIdType/>}/>
            <Route path="/petidtype/edit" element={<UpdatePetIdType />}/>
            <Route path="/petidtype/create" element={<CreatePetIdType />}/>
            {/*pet type*/}
            <Route path="/pettype" element={<PetType/>}/>
            <Route path="/pettype/edit" element={<UpdatePetType />}/>
            <Route path="/pettype/create" element={<CreatePetType />}/>
            <Route path="*" element=""/>
        </Routes>
    );
};

export default PrivateRoute;
