import { Box, Button, Grid, TextField, Alert } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../components/Header";
import {useEffect, useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const Login = () => {
  const notify = () => toast.success("Success!");
  const navigate = useNavigate();
  const [is_error, set_error] = useState(null);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  useEffect(()=>{
    window.scroll({"top":0,"behavior":"smooth"});
  },[])
  const handleFormSubmit = (values) => {

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        email: values.email,
        pass: values.password,
      })
      .then((res) => {
        if (res.data.status) {
          localStorage.setItem("pet-token", res.data?.data?.remember_token);
          localStorage.removeItem("page");
          set_error(false);
          notify();
          navigate("/");
          window.location.reload();
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

  return (
    <Grid
      container
      justifyContent={"center"}
      alignContent="center"
      style={{ height: "100vh" }}
    >
      <Grid item xs={12} md={4}>
        <Box m="20px">
          <Header title="Login" subtitle="Welcome Back!" center={"center"} />
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
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
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
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 4" }}
                  />
                </Box>
                {is_error ? (
                  <>
                    <Box mt={2} />{" "}
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
  );
};

const checkoutSchema = yup?.object().shape({
  email: yup.string().email("invalid email").required("This field required"),
  password: yup.string().required("This field required").min(6),
});
const initialValues = {
  email: "",
  password: "",
};

export default Login;
