import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Grid,
    TextField
} from "@mui/material";
import Header from "../../components/Header";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Formik} from "formik";
import * as yup from "yup";

const UpdateDistance = () => {
    const {state} = useLocation();
    const notify = () => toast.success("Success!");
    const navigate = useNavigate();
    const [is_error, set_error] = useState(null);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    useEffect(()=>{
        window.scroll({"top":0,"behavior":"smooth"});
    },[])
    const handleFormSubmit = (values) => {
        let formData = new FormData();
        if(values.title != state.title){
            formData.append("distance",Number(values.title))
        }
        formData.append("_id",values.id)
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("pet-token")}`,
            }
        }
        axios
            .post(`${process.env.REACT_APP_API_URL}/api/pet/notification/distance/add`, {
                _id:values.id,
                distance:values.title ?? "",
            }, config)
            .then((res) => {
                if (res.data.status) {
                    set_error(false);
                    notify();
                    navigate("/distance");
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

    const checkoutSchema = yup.object().shape({
        title: yup.string().required("This field required"),
    });

    const initialValues = {
        title: state.title,
        id: state.id,
    };


    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Update Distance" subtitle="" center={undefined}/>
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
                            enableReinitialize={true}
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
                                            type="number"
                                            label="Distance"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.title}
                                            name="title"
                                            error={!!touched.title && !!errors.title}
                                            helperText={touched.title && errors.title}
                                            sx={{gridColumn: "span 4"}}
                                        />

                                        <input type="hidden" name="id" onBlur={handleBlur}
                                               onChange={handleChange}
                                               value={values.id}/>

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

export default UpdateDistance;