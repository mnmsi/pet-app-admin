import React, {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import Header from "../../components/Header";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const UserPets = () => {
    // const {navigate} = useNavigate();
    const {state} = useLocation();
    let isAuth = localStorage.getItem("pet-token") ?? null;
    const [petList, setPetList] = useState([]);
    useEffect(() => {
        window.scroll({"top": 0, "behavior": "smooth"});
        axios.get(`${process.env.REACT_APP_API_URL}/api/pet/myPets`,
            {headers: {Authorization: `Bearer ${isAuth}`}, params: {userEmail: state.email}}
        ).then((res) => {
            if (res.data.data) {
                setPetList(res.data.data);
            }
        })
    }, [state])

    let renderPetList = null;
    if (petList.length > 0) {
        renderPetList = petList.map((pet, index) => {
            console.log(Object.values(pet.lostLocationDetails)?.toString().split(",").join("\n"))
            return (
                <TableRow key={index}>
                    <TableCell>{pet.petName}</TableCell>
                    <TableCell>{pet.petType.title}</TableCell>
                    <TableCell>{pet.colour}</TableCell>
                    <TableCell>{pet.idInfo}</TableCell>
                    <TableCell>{pet.gender}</TableCell>
                    <TableCell>{pet.idType.title}</TableCell>
                    <TableCell>{pet.isLost ? "Yes" : "No"}</TableCell>
                    {/*<TableCell>{pet.lostLocation.coordinates[0] + "," +pet.lostLocation.coordinates[0]}</TableCell>*/}
                    <TableCell><p>Address :  {pet.lostLocationDetails?.address}</p>
                        <p>StreetNumber :  {pet.lostLocationDetails?.city}</p>
                        <p>StreetName :  {pet.lostLocationDetails?.streetName}</p>
                        <p>City : {pet.lostLocationDetails?.streetNumber}</p>
                    </TableCell>
                    <TableCell>{pet.species?.title}</TableCell>
                </TableRow>
            )
        })
    }else{
        renderPetList = <TableRow><TableCell align="center" colSpan={9}>No Pets Found</TableCell></TableRow>;
    }

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="USER PETS" subtitle="User Pets List"/>
            </Box>
            <Typography variant="h2" sx={{mt: 2, mb: 1, fontWeight: "bold"}}>Pet List</Typography>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Type</TableCell>
                            <TableCell align="left">Color</TableCell>
                            <TableCell align="left">ID Info</TableCell>
                            <TableCell align="left">Gender</TableCell>
                            <TableCell align="left">ID Type</TableCell>
                            <TableCell align="left">Lost Status</TableCell>
                            <TableCell align="left">Lost Location</TableCell>
                            <TableCell align="left">Species</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderPetList}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserPets;