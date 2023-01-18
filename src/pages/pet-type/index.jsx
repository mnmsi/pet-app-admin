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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

const PetIdType = () => {
    const {pathname} = useLocation();
        const notify = () => toast.success("Success!");
        const error = () => toast.error("Error!");
        const [speciesList, setSpeciesList] = useState([]);
        const [isLoading, setLoading] = useState(true);
        const navigate = useNavigate();
        const [isDeleteAlert,setIsDeleteAlert] = useState(false);
        const [modalData,setModalData] = useState([]);

        let isAuth = localStorage.getItem("pet-token") ?? null;
        const config = {
            headers: {
                Authorization: `Bearer ${isAuth}`
            }
        }

        let getSpecies = () => {
            axios.get(`${process.env.REACT_APP_API_URL}/api/pettype/list`, config).then((res) => {
                if (res.data.data) {
                    setSpeciesList(res.data.data);
                    setLoading(false);
                }
            }).catch((err) => {
                // error();
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
                            {species.title ? species.title : "NULL"}
                        </TableCell>

                        <TableCell
                            align="left">{species.createdAt ? new Date(species.createdAt).toDateString() : "NULL"}</TableCell>
                        <TableCell align="left">
                            {species.img.length > 0 ? (<img style={{height:"30px",width:"30px"}} src={species.img[0]} alt="avatar"/>
                                                               ) : (<Avatar alt="avatar"/>)}
                        </TableCell>
                        <TableCell align="center">
                            <IconButton aria-label="edit" color="secondary"
                                        onClick={() => handleUpdate(species.title, species._id,species.img[0])}>
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

        const handleUpdate = (title, id,image) => {
            navigate(`/pettype/edit`, {
                state: {id: id, title: title,image:image}
            });
        }
        const handleDelete = (id) => {
            setIsDeleteAlert(true);
           let data = speciesList.filter((item) => item._id === id);
           setModalData(data[0]);
        }
        const handleDeleteAction = (id) => {
            axios.get(`${process.env.REACT_APP_API_URL}/api/pettype/admin/delete`,
                {headers: {Authorization: `Bearer ${isAuth}`}, params: {_id: id}}
            ).then((res) => {
                if (res.data.status) {
                    setIsDeleteAlert(false);
                    let newList = speciesList.filter((item) => item._id !== id);
                    setSpeciesList(newList);
                    notify();
                }
            }).catch((err) => {
                error();
                setIsDeleteAlert(false);
            });
        }
        return (
            <Box m="20px">
                {/* HEADER */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="Pet  Type" subtitle="List | Create | Update | Delete"/>
                    {/*    create new button */}
                    <Button variant="contained">
                        <Link to="/pettype/create" style={{textDecoration: "none", color: "white"}}>Create New</Link>
                    </Button>
                </Box>
                {/* start user section */}
                <Typography variant="h1" sx={{mt: 2, mb: 1}}>Pet Types</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell align="left">Created At</TableCell>
                                <TableCell align="left">Image</TableCell>
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

export default PetIdType;