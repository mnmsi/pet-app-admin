import React, {useEffect, useState} from 'react';
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
import {useNavigate} from "react-router";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Formik} from "formik";
import * as yup from "yup";
import {useLocation} from "react-router-dom";
import Typography from "@mui/material/Typography";

const UpdatePetType = () => {
    const {state} = useLocation();
    useEffect(() => {
        window.scroll({"top": 0, "behavior": "smooth"});
    }, [])
    const notify = () => toast.success("Success!");
    const error = () => toast.error("Error!");
    const navigate = useNavigate();
    const [is_error, set_error] = useState(null);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleFormSubmit = (values) => {
        let config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("pet-token")}`,
            }
        }

        let formData = new FormData()
        formData.append("title", values.title);
        formData.append("_id", state.id);
        if (values.image) {
            formData.append("img", values.image);
        }
        console.log(values);
        // axios
        //     .post(`${process.env.REACT_APP_API_URL}/api/pettype/admin/create`, formData
        //         , config)
        //     .then((res) => {
        //         if (res.data.status) {
        //             set_error(false);
        //             notify();
        //             navigate("/pettype");
        //         }
        //     })
        //     .catch((err) => {
        //         if (err.response.data) {
        //             set_error(err.response.data);
        //             error();
        //         }
        //     });
        setTimeout(() => {
            set_error(null);
        }, 3000);
    };
    const checkoutSchema = yup.object().shape({
        title: yup.string().required("This field required"),
        // image: yup.string().required("This field required"),
    });
    const initialValues = {
        title: state.title,
        id: state.id,
        image: "",
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Create Pet  Type" subtitle=""/>
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
                                  setFieldValue,
                                  values,
                                  errors,
                                  touched,
                                  handleBlur,
                                  handleChange,
                                  handleSubmit,
                              }) => (
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="id" value={values.id}/>
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
                                        <Typography variant={"h6"} mb={-3} sx={{color: "red"}}>Click bellow to upload
                                            new one.</Typography>
                                        <input id="imageFiled" accept="image/svg+xml" onChange={(e) => {
                                            values.image = e.target.files
                                            let files = e.target.files[0];
                                            setFieldValue("image", files);
                                        }} type="file" name="image" hidden/>
                                        <Box display="flex" justifyContent="center" alignItems="center" sx={{height:"150px",width:"150px", margin:"0 auto", borderRadius:"50%",border:"2px solid black"}}>
                                            <img onClick={() => {
                                                document.getElementById("imageFiled").click();
                                            }} height="100px" width="100px" src={state.image} alt={state.title}/>
                                        </Box>
                                        {errors.image ? <Typography mt={-3} sx={{color: 'red'}}
                                                                    variant="subtitle1"></Typography> : null}

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

export default UpdatePetType;