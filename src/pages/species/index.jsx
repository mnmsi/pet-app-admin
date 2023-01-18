import React, {useEffect, useState} from 'react';
import {Box, Button, IconButton} from "@mui/material";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

const Species = () => {
        const notify = () => toast.success("Success!");
        const [isLoading, setLoading] = useState(true);
    const [modalData,setModalData] = useState({});
    const [isDeleteAlert, setIsDeleteAlert] = React.useState(false);
        const error = () => toast.error("Error!");
        useEffect(() => {
            window.scroll({"top": 0, "behavior": "smooth"});
        }, [])
        const [speciesList, setSpeciesList] = useState([]);
        const navigate = useNavigate();
        let isAuth = localStorage.getItem("pet-token") ?? null;
        const config = {
            headers: {
                Authorization: `Bearer ${isAuth}`
            }
        }

        let getSpecies = () => {
            axios.get(`${process.env.REACT_APP_API_URL}/api/species/list`, config).then((res) => {
                if (res.data.data) {
                    setSpeciesList(res.data.data);
                    setLoading(false);
                }
            }).catch((err) => {

            })
        }
        useEffect(() => {
            getSpecies();
        }, [])
        let renderSpeciesList = null;
        if (speciesList.length > 0) {
            renderSpeciesList = speciesList.map((species, index) => {
                return (
                    <TableRow
                        key={index}
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                        <TableCell component="th" scope="row">
                            {species.title ? species.title : "NULL"}
                        </TableCell>
                        <TableCell
                            align="left">{species.createdAt ? new Date(species.createdAt).toDateString() : "NULL"}</TableCell>
                        <TableCell align="center">
                            <IconButton aria-label="edit" color="secondary"
                                        onClick={() => handleUpdate(species.title, species._id)}>
                                <EditRoundedIcon/>
                            </IconButton>
                            <IconButton aria-label="delete" color="error" onClick={() => handleDelete(species._id)}>
                                <Delete/>
                            </IconButton>

                        </TableCell>
                    </TableRow>
                )
            })
        }

        const handleUpdate = (title, id) => {
            navigate(`/species/edit`, {
                state: {id: id, title: title}
            });
        }
        const handleDelete = (id) => {
            setIsDeleteAlert(true);
            let data = speciesList.filter((item) => item._id === id);
            setModalData(data[0]);
        }


        const handleDeleteAction = (id) => {
            axios.get(`${process.env.REACT_APP_API_URL}/api/species/admin/delete`,
                {headers: {Authorization: `Bearer ${isAuth}`}, params: {_id: id}}
            ).then((res) => {
                if (res.data.status) {
                    setIsDeleteAlert(false);
                    let newList = speciesList.filter((item) => item._id !== id);
                    setSpeciesList(newList);
                    notify();
                }
            }).catch((err) => {
                setIsDeleteAlert(false);
                error();
            })
        }
        return (
            <Box m="20px">
                {/* HEADER */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="Species" subtitle="List | Create | Update | Delete"/>
                    {/*    create new button */}
                    <Button variant="contained">
                        <Link to="/species/create" style={{textDecoration: "none", color: "white"}}>Create New</Link>
                    </Button>
                </Box>
                {/* start user section */}
                <Typography variant="h1" sx={{mt: 2, mb: 1}}>Species</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell align="left">Created At</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? <TableRow>
                                <TableCell align="center" colSpan={3}>Loading...</TableCell>
                            </TableRow> : renderSpeciesList}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/*delete*/}
                <Dialog
                    fullWidth={true}
                    maxWidth={'xs'}
                    open={isDeleteAlert}
                    onClose={() => setIsDeleteAlert(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" sx={{fontSize: '18px'}}>
                        Alert!
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" sx={{fontSize: "16px"}}>
                            Are you sure you want to delete species <span
                            style={{fontWeight: "bold"}}>{modalData?.title}?</span> This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={() => setIsDeleteAlert(false)}>Cancel</Button>

                        <Button variant="contained" color="error"
                                onClick={() => handleDeleteAction(modalData._id)}>Delete</Button>
                    </DialogActions>
                </Dialog>
                {/*    delete*/}
            </Box>
        );
    }
;

export default Species;