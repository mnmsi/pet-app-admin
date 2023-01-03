import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Grid,
    MenuItem,
    TextField
} from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Formik} from "formik";
import * as yup from "yup";
import {useLocation} from "react-router-dom";

const CreateSpecies = () => {
    const { pathname } = useLocation();
    useEffect(()=>{
        window.scroll({"top":0,"behavior":"smooth"});
    },[])
    const notify = () => toast.success("Success!");
    const navigate = useNavigate();
    const [is_error, set_error] = useState(null);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleFormSubmit = (values) => {
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("pet-token")}`,
            }
        }
        axios
            .post(`${process.env.REACT_APP_API_URL}/api/species/admin/create`, {
                title: values.title,
                petType: values.petType,
            },config)
            .then((res) => {
                if (res.data.status) {
                    set_error(false);
                    notify();
                    navigate("/species");
                }
            })
            .catch((err) => {
                if (err.response.data) {
                    set_error(err.response.data);
                }
            });
        setTimeout(() => {
            set_error(null);
        }, 3000);
    };

    // let loadPetType = [{value: '', option: 'Select Pet Type'}];
    let [loadPetType,setLoadPetType] = useState([{value: '', option: 'Select Pet Type'}])
    let config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("pet-token")}`,
        }
    }
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/pettype/list`, config).then((res) => {
            if (res.data.status) {
                let data = res.data.data;
                const newData = data.map((item) => {
                        return ({value: item._id, option: item.title})
                })
                setLoadPetType(newData)
                // data.map((item) => {
                //     loadPetType.push({value: item._id, option: item.title})
                // })
            }
        })
    }, [pathname])

    console.log(loadPetType)

    const checkoutSchema = yup.object().shape({
        title: yup.string().required("This field required"),
        petType: yup.string().required("This field required"),
    });
    const initialValues = {
        title: "",
        petType: loadPetType[0].value,
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Create Species" subtitle=""/>
            </Box>
            <Grid
                container
                justifyContent={"center"}
                alignContent="center"
                // style={{ height: "100vh" }}
            >
                <Grid item xs={12} md={6}>
                    <Box m="20px">
                        <Formik
                            onSubmit={handleFormSubmit}
                            initialValues={initialValues}
                            validationSchema={checkoutSchema}
                        >
                            {({
                                  values,
                                  errors,
                                  touched,
                                  handleBlur,
                                  handleChange,
                                  handleSubmit,
                              }) => (
                                <form onSubmit={handleSubmit}>
                                    <Box
                                        display="flex"
                                        gap="30px"
                                        flexDirection={"column"}
                                        sx={{
                                            "& > div": {
                                                gridColumn: isNonMobile ? undefined : "span 4",
                                            },
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Title"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.title}
                                            name="title"
                                            error={!!touched.title && !!errors.title}
                                            helperText={touched.title && errors.title}
                                            sx={{gridColumn: "span 4"}}
                                        />
                                        <TextField
                                            name="petType"
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Pet Type"
                                            select
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.petType}
                                            error={!!touched.petType && !!errors.petType}
                                            helperText={touched.petType && errors.petType}
                                            sx={{gridColumn: "span 4"}}>
                                            {loadPetType?.map((item, index) => {
                                                return <MenuItem key={index} value={item.value}>{item.option}</MenuItem>
                                            })}
                                        </TextField>

                                    </Box>
                                    {is_error ? (
                                        <>
                                            <Box mt={2}/>{" "}
                                            <Alert severity="error">{is_error.message}</Alert>
                                        </>
                                    ) : null}

                                    <Box display="flex" justifyContent="center" mt="20px">
                                        <Button
                                            type="submit"
                                            color="primary"
                                            variant="contained"
                                            size="large"
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CreateSpecies;