import {Avatar, Box, IconButton, Pagination, Typography} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Header from "../components/Header";
import {useEffect, useState } from "react";
import PetsIcon from '@mui/icons-material/Pets';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import axios from "axios";
import {useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

const Dashboard = () => {
    const navigate = useNavigate();
    let localpage = localStorage.getItem("page") ?? 1;
    const [userList, setUserlist] = useState([]);
    const [isLoading, setLoading] = useState(true);
    let [totalPage, setTotalPage] = useState(0);
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
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/list?page=${page}&limit=7`, config).then((res) => {
            if (res.data.data) {
                setLoading(false);
                setUserlist(res.data.data?.user_res);
                setPage(Number(res.data.data?.currentPage));
                setTotalPage(res.data.data?.totalPages);
            }
        })
    }, [page])

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
                        {user.profileImg.length > 0 ? (<Avatar  src={user.profileImg[0]}
                                                               alt={user.name?.toUpperCase()}/>) : (<Avatar alt={user.name?.toUpperCase()}/>)}
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

    // show pets

    const ShowPets = (email) => {
        navigate(`/user-pets`, {state: {email: email}});

    }

    // ban user
    const notify = () => toast.success("Success!");
    const error = () => toast.error("Error!");
    const handleBan = (id) => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/users/Ban_and_UnBan`, {_id: id}, config,
        ).then((res) => {
            if (res.status) {
                notify();
                userList.filter((user) => user._id !== id);
                let newuserList = userList.map((user) => {
                    return user._id === id ? {...user, isBan: !user.isBan} : user
                })
                setUserlist(newuserList);
            } else {
                error();
            }
        }).catch((err)=>{
           toast.error(err.response.data.message)
        })
    }

    // delete user

    const handleDelete = (id) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/delete`, {
                headers: {Authorization: `Bearer ${isAuth}`},
                params: {_id: id}
            },
        ).then((res) => {
            if (res.status) {
                notify();
                setUserlist(userList.filter((user) => user._id !== id));
            } else {
                error();
            }
        }).catch((err) => {
            toast.error(err.response.data.message)
        })
    }

    // pagination
    const handlePagination = (e, page) => {
        setPage(page);
        localStorage.setItem("page", page);
    }

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to your dashboard"/>
            </Box>
            {/* start user section */}
            <Typography variant="h1" sx={{mt: 2, mb: 1}}>User List</Typography>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
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
                            onChange={(e, page) => handlePagination(e,page)}/>
            </Box> : null}
        </Box>
    );
};

export default Dashboard;
