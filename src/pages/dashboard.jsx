import {
    Avatar,
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Typography
} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Header from "../components/Header";
import React, {useEffect, useState} from "react";
import PetsIcon from '@mui/icons-material/Pets';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const Dashboard = () => {
    const [isBanAlert, setIsBanAlert] = useState(false);
    const [isDeleteAlert, setIsDeleteAlert] = useState(false);
    const [modalData, setModalData] = useState([]);
    const navigate = useNavigate();
    let localpage = localStorage.getItem("page") ?? 1;
    const [userList, setUserlist] = useState([]);
    const [isLoading, setLoading] = useState(true);
    let [totalPage, setTotalPage] = useState(0);
    let [limit, setLimit] = useState(10);
    let [page, setPage] = useState(localpage);
    let renderuserList = null;
    let isAuth = localStorage.getItem("pet-token") ?? null;
    const config = {
        headers: {
            Authorization: `Bearer ${isAuth}`
        }
    }
    useEffect(() => {
        window.scroll({"top": 0, "behavior": "smooth"});
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/list?page=${page}&limit=${limit}`, config).then((res) => {
            if (res.data.data) {
                setLoading(false);
                setUserlist(res.data.data?.user_res);
                setPage(Number(res.data.data?.currentPage));
                setTotalPage(res.data.data?.totalPages);
            }
        })
    }, [page, limit]);

    if (userList.length > 0) {
        renderuserList = userList.map((user, index) => {
            return (
                <TableRow
                    key={index}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                    <TableCell component="th" scope="row">
                        {user.name ? user.name : "NULL"}
                    </TableCell>
                    <TableCell align="left">{user.email ? user.email : "NULL"}</TableCell>
                    <TableCell align="left">{user.phone ? user.phone : "NULL"}</TableCell>
                    <TableCell align="left">{user.city ? user.city : "NULL"}</TableCell>
                    <TableCell align="left">{user.country ? user.country : "NULL"}</TableCell>
                    <TableCell align="left">
                        {user.profileImg.length > 0 ? (<Avatar src={user.profileImg[0]}
                                                               alt={user.name?.toUpperCase()}/>) : (
                            <Avatar alt={user.name?.toUpperCase()}/>)}
                    </TableCell>
                    <TableCell align="left">{user.isBan ? "Yes" : "No"}</TableCell>
                    <TableCell align="center">
                        <IconButton aria-label="show" color="secondary" onClick={() => ShowPets(user.email)}>
                            <PetsIcon/>
                        </IconButton>
                        <IconButton aria-label="ban" color="error" onClick={() => handleBan(user._id)}>
                            <BlockIcon/>
                        </IconButton>
                        <IconButton aria-label="delete" color="warning" onClick={() => handleDelete(user._id)}>
                            <DeleteIcon/>
                        </IconButton>
                    </TableCell>
                </TableRow>
            )
        })
    } else {
        //     show data not found
        renderuserList = <TableRow><TableCell align="center" colSpan={8}>No User Found</TableCell></TableRow>;
    }

    // event trigger
    const handleLimit = (e) => {
        setLimit(e.target.value);
    }
    // show pets

    const ShowPets = (email) => {
        navigate(`/user-pets`, {state: {email: email}});

    }

    // ban user
    const notify = () => toast.success("Success!");
    const error = () => toast.error("Error!");
    const handleBan = (id) => {
        setIsBanAlert(true);
        let data = userList.filter((user) => user._id === id);
        setModalData(data[0]);

    }

    // delete user

    const handleDelete = (id) => {
        setIsDeleteAlert(true);
        let data = userList.filter((user) => user._id === id);
        setModalData(data[0]);
    }

    const handleDeleteAction = (id) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/delete`, {
                headers: {Authorization: `Bearer ${isAuth}`},
                params: {_id: id}
            },
        ).then((res) => {
            if (res.status) {
                notify();
                setIsDeleteAlert(false);
                setUserlist(userList.filter((user) => user._id !== id));
            } else {
                error();
                setIsDeleteAlert(false);
            }
        }).catch((err) => {
            toast.error(err.response.data.message)
            setIsDeleteAlert(false);
        })
    }

    // pagination
    const handlePagination = (e, page) => {
        setPage(page);
        localStorage.setItem("page", page);
    }

    const HandleAction = (id) => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/users/Ban_and_UnBan`, {_id: id}, config,
        ).then((res) => {
            if (res.status) {
                notify();
                setIsBanAlert(false);
                userList.filter((user) => user._id !== id);
                let newuserList = userList.map((user) => {
                    return user._id === id ? {...user, isBan: !user.isBan} : user
                })
                setUserlist(newuserList);
            } else {
                error();
                setIsBanAlert(false);
            }
        }).catch((err) => {
            setIsBanAlert(false);
            toast.error(err.response.data.message)
        })

    }

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to your dashboard"/>
            </Box>
            {/* start user section */}
            <Typography variant="h1" sx={{mt: 2, mb: 1}}>User List</Typography>
            <Box mt="10px" mb="10px" display="flex" justifyContent="end" sx={{}}>
                <FormControl variant="outlined" sx={{minWidth: 300}}>
                    <InputLabel id="demo-simple-select-outlined-label">Limit</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={limit}
                        label="Limit"
                        onChange={handleLimit}
                    >
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem selected value="10">10</MenuItem>
                        <MenuItem value="15">15</MenuItem>
                        <MenuItem value="20">20</MenuItem>
                        <MenuItem value="25">25</MenuItem>
                        <MenuItem value="30">30</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Phone</TableCell>
                            <TableCell align="left">City</TableCell>
                            <TableCell align="left">Country</TableCell>
                            <TableCell align="left">Avatar</TableCell>
                            <TableCell align="left">Ban Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            isLoading ? <TableRow>
                                <TableCell align="center"
                                           colSpan={8}>Loading...</TableCell>
                            </TableRow> : renderuserList
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {Number(totalPage) > 1 ? <Box display="flex" justifyContent="flex-end" sx={{mt: 2}}>
                <Pagination siblingCount={0} boundaryCount={2} count={totalPage} page={Number(page)}
                            onChange={(e, page) => handlePagination(e, page)}/>
            </Box> : null}
            {/* modal */}
            <Dialog
                fullWidth={true}
                open={isBanAlert}
                maxWidth={'xs'}
                onClose={() => setIsBanAlert(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{fontSize: '18px'}}>
                    Alert!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{fontSize: "16px"}}>
                        {`Are you sure you want to ${modalData?.isBan ? 'unban' : 'ban'} user `} <span
                        style={{fontWeight: "bold"}}>{modalData.name}?</span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={() => setIsBanAlert(false)}>Cancel</Button>
                    {modalData?.isBan ? <Button variant="contained" color="error"
                                                onClick={() => HandleAction(modalData._id)}>Unban</Button> :
                        <Button variant="contained" color="error"
                                onClick={() => HandleAction(modalData._id)}>Ban</Button>}
                </DialogActions>
            </Dialog>
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
                        Are you sure you want to delete user <span
                        style={{fontWeight: "bold"}}>{modalData.name}?</span> This action cannot be undone.
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

export default Dashboard;
