import {useState} from "react";
import {ProSidebar, Menu, MenuItem} from "react-pro-sidebar";
import {Box, Button, Typography, useTheme} from "@mui/material";
import {Link, useLocation} from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import {tokens} from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PetsIcon from "@mui/icons-material/Pets";
import {Logout} from "@mui/icons-material";
import axios from "axios";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TypeSpecimenIcon from '@mui/icons-material/TypeSpecimen';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import {toast} from 'react-toastify';

const Item = ({title, to, icon, selected, setSelected}) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to}/>
        </MenuItem>
    );
};

const Sidebar = () => {
    const notify = () => toast.success("You are logged out!");
    const error = () => toast.error("Something went wrong!");
    const {pathname} = useLocation();
    let pathName = pathname.split("/")[1].slice(0, 1).toUpperCase() + pathname.split("/")[1]?.slice(1);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [selected, setSelected] = useState(pathName ? pathName : "Dashboard");
    // logout
    const logout = () => {

        let token = localStorage.getItem("pet-token");
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/logout`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            if (res.status) {
                notify();
                localStorage.removeItem("pet-token");
                window.location.href = "/login";
                window.location.reload();
            }
        }).catch((err) => {
            if (err) {
                window.location.href = "/login";
                window.location.reload();
            }
        })
    }
    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[400]} !important`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
            }}
        >
            <ProSidebar >
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100],
                        }}
                    >
                            <Box
                                ml="15px"
                            >
                                <Typography textAlign="center" variant="h4" color={colors.grey[100]}>
                                   TBAF App Admin Panel
                                </Typography>
                            </Box>
                    </MenuItem>
                    <Box mb="25px">
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <img
                                alt="profile-user"
                                width="100px"
                                height="100px"
                                src={`../../assets/logo.svg`}
                                style={{cursor: "pointer", borderRadius: "50%"}}
                            />
                        </Box>
                        <Box textAlign="center">
                            <Typography
                                variant="h2"
                                color={colors.grey[100]}
                                fontWeight="bold"
                                sx={{m: "10px 0 0 0"}}
                            >
                                Admin
                            </Typography>
                            <Typography variant="h5" color={colors.greenAccent[500]}>
                                TBAF Admin
                            </Typography>
                        </Box>
                    </Box>

                    <Box paddingLeft={"10%"}>
                        <Item
                            title="Dashboard"
                            to="/"
                            icon={<HomeOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Pets"
                            to="/pets"
                            icon={<PetsIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Species"
                            to="/species"
                            icon={<ContactsOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Petidtype"
                            to="/petidtype"
                            icon={<TypeSpecimenIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Pettype"
                            to="/pettype"
                            icon={<CatchingPokemonIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Distance"
                            to="/distance"
                            icon={<LocationOnIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <MenuItem style={{marginTop: "20px"}}>
                            <Button onClick={() => logout()} variant="contained" startIcon={<Logout/>}>
                                Logout
                            </Button>
                        </MenuItem>
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;
