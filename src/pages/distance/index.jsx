import React, {useEffect, useState} from 'react';
import {Avatar, Box, Button, IconButton} from "@mui/material";
import Header from "../../components/Header";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import axios from "axios";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {Delete} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";

const Distance = () => {
        const {pathname} = useLocation();
        const notify = () => toast.success("Success!");
        const error = () => toast.error("Error!");
        const [speciesList, setSpeciesList] = useState([]);
        const [isLoading, setLoading] = useState(true);
        const navigate = useNavigate();
        let isAuth = localStorage.getItem("pet-token") ?? null;
        const config = {
            headers: {
                Authorization: `Bearer ${isAuth}`
            }
        }

        let getSpecies = () => {
            axios.get(`${process.env.REACT_APP_API_URL}/api/pet/notification/distance`, config).then((res) => {
                if (res.data.data) {
                    setSpeciesList(res.data.data);
                    setLoading(false);
                }
            }).catch((err) => {
               error();
            })
        }
        useEffect(() => {
            getSpecies();
            window.scroll({"top": 0, "behavior": "smooth"});
        }, [pathname])

        let renderSpeciesList = null;
        if (speciesList.length > 0) {
            renderSpeciesList = speciesList.map((species, index) => {
                return (
                    <TableRow
                        key={index}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell component="th" scope="row">
                            {species.distance ? species.distance : "NULL"}
                        </TableCell>
                        <TableCell align="center">
                            <b>Users within a <span style={{color:"red",fontSize:"14px"}}>{species.distance} kilometers</span> radius of the location where the pet went missing will be notified.</b>
                        </TableCell>
                        <TableCell
                            align="left">{species.updatedAt ? new Date(species.updatedAt).toDateString() : "NULL"}</TableCell>
                        <TableCell align="center">
                            <IconButton aria-label="edit" color="secondary"
                                        onClick={() => handleUpdate(species.distance, species._id)}>
                                <EditRoundedIcon/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                )
            })
        }
        const handleUpdate = (title, id) => {
            navigate(`/distance/edit`, {
                state: {id: id, title: title}
            });
        }
        // const handleDelete = (id) => {
        //     axios.get(`${process.env.REACT_APP_API_URL}/api/pettype/admin/delete`,
        //         {headers: {Authorization: `Bearer ${isAuth}`}, params: {_id: id}}
        //     ).then((res) => {
        //         if (res.data.status) {
        //             let newList = speciesList.filter((item) => item._id !== id);
        //             setSpeciesList(newList);
        //             notify();
        //         }
        //     }).catch((err) => {
        //         error();
        //     });
        // }
        return (
            <Box m="20px">
                {/* HEADER */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="Distance" subtitle="List  | Update "/>
                    {/*    create new button */}
                </Box>
                {/* start user section */}
                <Typography variant="h2" sx={{mt: 2, mb: 1}}>Notification Distance</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Distance</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="left">Created At</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? <TableRow>
                                <TableCell colSpan={4} align="center">Loading...</TableCell>
                            </TableRow> : renderSpeciesList}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    }
;

export default Distance;