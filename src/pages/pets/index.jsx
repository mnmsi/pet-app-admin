import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    FormControl, IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField,
    Typography
} from "@mui/material";
import Header from "../../components/Header";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import {toast} from "react-toastify";
import DialogContent from "@mui/material/DialogContent";

const Pets = () => {
    const notify = () => toast.success("Success!");
    const error = () => toast.error("Error!");
    let [petList, setPetList] = useState([]);
    let [isLoading, setLoading] = useState(true);
    let [page, setPage] = useState(1);
    let [found, setFound] = useState("");
    let [lost, setLost] = useState("");
    let [query, setQuery] = useState("");
    const [modalData,setModalData] = useState({});
    const [isDeleteAlert, setIsDeleteAlert] = React.useState(false);
    let [totalPage, setTotalPage] = useState(0);
    let [select, setSelect] = useState("");
    let [limit, setLimit] = useState(10);
    let [safe, setSafe] = useState("");
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/pet/list?lost=${lost}&found=${found}&query=${query}&limit=${limit}&page=${page}&safe=${safe}`, {headers: {Authorization: `Bearer ${isAuth}`},}).then((res) => {
            if (res.data.data) {
                setPage(res.data.data?.currentPage);
                setTotalPage(res.data.data?.totalPages);
                setPetList(res.data.data?.pet_res);
                setLoading(false);
            }
        })
    }, [page, found, lost, query, limit, safe]);

    // handle lost found
    const handleLostFound = (e) => {
        setSelect(e.target.value);
        if (e.target.value === "lost") {
            setLost(1);
            setFound("");
            setSafe("");
        } else if (e.target.value === "found") {
            setLost("");
            setFound(1);
            setSafe("");
        } else if (e.target.value === "safe") {
            setSafe(1);
            setLost("");
            setFound("");
        } else {
            setLost("");
            setFound("");
            setSafe("");
        }
    }
    // handle limit
    const handleLimit = (e) => {
        setLimit(e.target.value);
    }
    // show sighting
    const [open, setOpen] = useState(false);
    const [sighting, setSighting] = useState([]);
    const showLostPetInfo = (e, pet) => {
        if (pet.length > 0) {
            let renderSighting = pet.map((item, index) => {
                return (
                    <TableRow key={index}>
                        <TableCell>{item.name ?? "Null"}</TableCell>
                        <TableCell>{item.sightedBy}</TableCell>
                        <TableCell>{item.sightingLocationDetails}</TableCell>
                        <TableCell>{new Date(item.sightingTime)?.toLocaleTimeString()}</TableCell>
                        <TableCell>{new Date(item.sightingTime)?.toLocaleDateString("en-US")}</TableCell>
                    </TableRow>
                )
            })
            setSighting(renderSighting);
        } else {
            let renderSighting = (
                <TableRow>
                    <TableCell align="center" colSpan={5}>No sighting</TableCell>
                </TableRow>
            )
            setSighting(renderSighting);
        }
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    // delete pet
    let isAuth = localStorage.getItem("pet-token") ?? null;
    const handleDelete = (e, id) => {
        e.stopPropagation();
        setIsDeleteAlert(true);
        let data = petList?.filter((item) => item._id === id);
        setModalData(data[0]);
    }

    console.log(modalData);

    const handleDeleteAction = (id) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/pet/delete`, {
                headers: {Authorization: `Bearer ${isAuth}`},
                params: {_id: id}
            },
        ).then((res) => {
            if (res.status) {
                setIsDeleteAlert(false);
                notify();
                setPetList(petList.filter((pet) => pet._id !== id));
            } else {
                error();
                setIsDeleteAlert(false);
            }
        }).catch((err) => {
            error();
            setIsDeleteAlert(false);
        })
    }

    let renderPetList = null;
    if (petList.length > 0) {
        renderPetList = petList.map((pet, index) => {
            return (
                <TableRow key={index} sx={{cursor: "pointer"}} onClick={(e) => showLostPetInfo(e, pet.sighting)}>
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
                    <TableCell>
                        <IconButton aria-label="delete" color="warning" onClick={(e) => handleDelete(e, pet._id)}>
                            <DeleteIcon/>
                        </IconButton>
                    </TableCell>
                </TableRow>
            )
        })
    } else {
        renderPetList = <TableRow>
            <TableCell colSpan={12} align="center">No data found</TableCell>
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
                    label="Type Pet Owner Name/Pet Name/Pet Type/Species/Colour/Gender"
                    fullWidth
                    variant="outlined"

                    onChange={(e) => setQuery(e.target.value)}
                />

                <FormControl sx={{minWidth:300}}>
                    <InputLabel id="demo-simple-select-label">Lost/Found/Safe</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={select}
                        label="Safe/Lost/Found"
                        onChange={handleLostFound}
                    >
                        <MenuItem selected value="select">Select</MenuItem>
                        <MenuItem value="safe">Safe</MenuItem>
                        <MenuItem value="lost">Lost</MenuItem>
                        <MenuItem value="found">Found</MenuItem>
                    </Select>
                </FormControl>
                {/*limit dropdown*/}
                <FormControl variant="outlined" sx={{minWidth: 300}}>
                    <InputLabel id="demo-simple-select-outlined-label">Limit</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={limit}
                        label="Limit"
                        onChange={handleLimit}
                    >
                        <MenuItem  value="5">5</MenuItem>
                        <MenuItem selected value="10">10</MenuItem>
                        <MenuItem value="15">15</MenuItem>
                        <MenuItem value="20">20</MenuItem>
                        <MenuItem value="25">25</MenuItem>
                        <MenuItem value="30">30</MenuItem>
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
                            <TableCell align="center">Action</TableCell>
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
            {/*dialog*/}
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth={true}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle sx={{fontSize: "20px", fontWeight: "600"}} id="alert-dialog-title">
                        {"Sighting Information"}
                    </DialogTitle>
                    <Box mx="20px">
                        <DialogContentText id="alert-dialog-description">
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{fontWeight: "bold"}}>Sighted By</TableCell>
                                            <TableCell sx={{fontWeight: "bold"}}>Email</TableCell>
                                            <TableCell sx={{fontWeight: "bold"}}>Location</TableCell>
                                            <TableCell sx={{fontWeight: "bold"}}>Time</TableCell>
                                            <TableCell sx={{fontWeight: "bold"}}>Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sighting}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContentText>
                    </Box>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
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
                        Are you sure you want to delete pet <span
                        style={{fontWeight: "bold"}}>{modalData?.petName}?</span> This action cannot be undone.
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
};

export default Pets;