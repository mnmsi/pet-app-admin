import React, {useEffect, useState} from 'react';
import {Avatar, Box, FormControl, InputLabel, MenuItem, Pagination, Select, TextField, Typography} from "@mui/material";
import Header from "../../components/Header";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import axios from "axios";

const Pets = () => {
    let [petList, setPetList] = useState([]);
    let [isLoading, setLoading] = useState(true);
    let [page, setPage] = useState(1);
    let [found, setFound] = useState("");
    let [lost, setLost] = useState("");
    let [query, setQuery] = useState("");
    let [totalPage, setTotalPage] = useState(0);
    let [select, setSelect] = useState("");
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/pet/list?lost=${lost}&found=${found}&query=${query}&limit=7&page=${page}`).then((res) => {
            if (res.data.data) {
                setPage(res.data.data?.currentPage);
                setTotalPage(res.data.data?.totalPages);
                setPetList(res.data.data?.pet_res);
                setLoading(false);
            }
        })
    }, [page, found, lost, query])

    // handle lost found
    const handleLostFound = (e) => {
        setSelect(e.target.value);
        if (e.target.value === "lost") {
            setLost(1);
            setFound("");
        } else if (e.target.value === "found") {
            setLost("");
            setFound(1);
        } else {
            setLost("");
            setFound("");
        }
    }

    let renderPetList = null;
    if (petList.length > 0) {
        renderPetList = petList.map((pet, index) => {
            return (
                <TableRow key={index}>
                    <TableCell>{pet.owner?.name}</TableCell>
                    <TableCell>{pet.petName}</TableCell>
                    <TableCell>{pet.profileImg?.length > 0 ? <Avatar src={pet.profileImg[0]}/> : <Avatar/>}</TableCell>
                    <TableCell>{pet.petType.title}</TableCell>
                    <TableCell>{pet.colour}</TableCell>
                    <TableCell>{pet.idInfo}</TableCell>
                    <TableCell>{pet.gender}</TableCell>
                    <TableCell>{pet.idType.title}</TableCell>
                    <TableCell>{pet.isLost ? "Yes" : "No"}</TableCell>
                    {/*<TableCell>{pet.lostLocation.coordinates[0] + "," +pet.lostLocation.coordinates[0]}</TableCell>*/}
                    <TableCell><p>Address : {pet.lostLocationDetails?.address ?? "Null"}</p>
                        <p>StreetNumber : {pet.lostLocationDetails?.streetNumber ?? "Null"}</p>
                        <p>StreetName : {pet.lostLocationDetails?.streetName ?? "Null"}</p>
                        <p>City : {pet.lostLocationDetails?.city ?? "Null"}</p>
                    </TableCell>
                    <TableCell>{pet.species?.title}</TableCell>
                </TableRow>
            )
        })
    } else {
        renderPetList = <TableRow>
            <TableCell colSpan={11} align="center">No data found</TableCell>
        </TableRow>
    }
    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="PETS LIST" subtitle="All pets information"/>
            </Box>
            {/* start user section */}
            <Box display="flex" alignItems="center" sx={{mb: 2}} gap="1rem">
                {/*<Typography variant="h2" sx={{mt: 4, mb: 1}}>Pets</Typography>*/}
                {/*   search*/}
                <TextField
                    label="Search"
                    fullWidth
                    variant="outlined"

                    onChange={(e) => setQuery(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Lost/Found</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={select}
                        label="Lost/Found"
                        onChange={handleLostFound}
                    >
                        <MenuItem selected value="select">Select</MenuItem>
                        <MenuItem value="lost">Lost</MenuItem>
                        <MenuItem value="found">Found</MenuItem>
                    </Select>
                </FormControl>
            </Box>
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
                        {
                            isLoading ? <TableRow>
                                <TableCell align="center"
                                           colSpan={11}>Loading...</TableCell>
                            </TableRow> : renderPetList
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {Number(totalPage) > 1 ? <Box display="flex" justifyContent="flex-end" sx={{mt: 2}}>
                <Pagination siblingCount={0} boundaryCount={2} count={totalPage} page={Number(page)}
                            onChange={(e, page) => setPage(page)}/>
            </Box> : null}
        </Box>
    );
};

export default Pets;