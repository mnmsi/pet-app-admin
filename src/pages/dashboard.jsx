import {Avatar, Box, Button, IconButton, Skeleton, Typography, useTheme} from "@mui/material";
import {tokens} from "../theme";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Header from "../components/Header";
import {useEffect, useState} from "react";
import PetsIcon from '@mui/icons-material/Pets';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import axios from "axios";

const Dashboard = () => {
    const [userList, setUserlist] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    let renderuserList = <Skeleton/>
    let isAuth = localStorage.getItem("pet-token") ?? null;
    const config = {
        headers: {
            Authorization: `Bearer ${isAuth}`
        }
    }
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/list`, config).then((res) => {
            if (res.data.data) {
                setUserlist(res.data.data);
            }
        })
    }, [])

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
                                                               alt="avatar"/>) : (<Avatar alt="avatar"/>)}
                    </TableCell>
                    <TableCell align="left">{user.isBan === "false" ? "Yes" : "No"}</TableCell>
                    <TableCell align="center">
                        <IconButton aria-label="show" color="secondary" onClick={() => ShowPets(user._id)}>
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
    }

    // event trigger

    // show pets

    const ShowPets = (id) => {
        console.log(id)
    }

    // ban user

    const handleBan = (id) => {
        console.log(id)
        axios.post(`${process.env.REACT_APP_API_URL}/api/users/Ban_and_UnBan`, {_id:id},

            ).then((res) => {
            if (res.data.success) {
                window.location.reload();
            }
        })
    }

    // delete user

    const handleDelete = (id) => {
        console.log(id)
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
                        {renderuserList}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Dashboard;
