import React, {useEffect, useState} from 'react';
import {Avatar, Box, Typography} from "@mui/material";
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
import {useNavigate,useSearchParams} from "react-router-dom";

const UserPets = () => {
    // const {navigate} = useNavigate();
    const {state} = useLocation();
    const [searchParams,setSearchParams] = useSearchParams();
    console.log(searchParams.get("page"));
    let isAuth = localStorage.getItem("pet-token") ?? null;
    const [petList, setPetList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        window.scroll({"top": 0, "behavior": "smooth"});
        axios.get(`${process.env.REACT_APP_API_URL}/api/pet/myPets`,
            {headers: {Authorization: `Bearer ${isAuth}`}, params: {userEmail: state.email}}
        ).then((res) => {
            if (res.data.data) {
                setLoading(false);
                setPetList(res.data.data);
            }
        })
    }, [state])

    let renderPetList = null;
    if (petList.length > 0) {
        renderPetList = petList.map((pet, index) => {
            return (
                <TableRow key={index}>
                    <TableCell>{pet.owner?.name}</TableCell>
                    <TableCell>{pet.petName}</TableCell>
                    <TableCell>{pet.profileImg?.length > 0 ? <Avatar src={pet.profileImg[0]} /> : <Avatar />}</TableCell>
                    <TableCell>{pet.petType.title}</TableCell>
                    <TableCell>{pet.colour}</TableCell>
                    <TableCell>{pet.idInfo}</TableCell>
                    <TableCell>{pet.gender}</TableCell>
                    <TableCell>{pet.idType.title}</TableCell>
                    <TableCell>{pet.isLost ? "Yes" : "No"}</TableCell>
                    {/*<TableCell>{pet.lostLocation.coordinates[0] + "," +pet.lostLocation.coordinates[0]}</TableCell>*/}
                    <TableCell><p>Address : {pet.lostLocationDetails?.address ?? "Null" }</p>
                        <p>StreetNumber : {pet.lostLocationDetails?.streetNumber ?? "Null" }</p>
                        <p>StreetName : {pet.lostLocationDetails?.streetName ?? "Null" }</p>
                        <p>City : {pet.lostLocationDetails?.city ?? "Null" }</p>
                    </TableCell>
                    <TableCell>{pet.species?.title}</TableCell>
                </TableRow>
            )
        })
    } else {
        renderPetList = <TableRow><TableCell align="center" colSpan={11}>No Pets Found</TableCell></TableRow>;
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
                            <TableCell>Owner</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Image</TableCell>
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
                        {isLoading ? <TableRow>
                            <TableCell align="center" colSpan={11}>Loading...</TableCell>
                        </TableRow> : renderPetList}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserPets;