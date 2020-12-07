import React, { useState, useContext } from "react";

// importing Material ui components
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

// SweetAlert is used to show error in Register form
import SweetAlert from "sweetalert2-react";

import { useHistory } from "react-router-dom";

// importing UserContext to get userData from it
import { UserContext } from "../../Context/UserContext";

import Axios from "axios";

export default function Register() {
  const [obj, setObj] = useState({}); // obj will store form data
  const [error, setError] = useState(false); // To store error coming from node server

  const { userData, setUserData } = useContext(UserContext);

  const history = useHistory();
  console.log(userData);
  const handleInputChange = (event) => {
    const vaule = event.target.value;
    const name = event.target.name;
    setObj({
      ...obj,
      [name]: vaule,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      let newUser = obj;

      // Registering new User by sending post request to backend
      await Axios.post("http://localhost:5000/users/register", newUser);

      //Login User after registering
      const loginres = await Axios.post("http://localhost:5000/users/login", {
        username: newUser.username,
        password: newUser.password,
      });

      setUserData({
        token: loginres.data.token,
        user: loginres.data.user,
      });

      //Set AUTH Token to localStorage so person does not have to login every time
      localStorage.setItem("auth-token", loginres.data.token);
      history.push("/");
    } catch (err) {
      // If there is error in form submission it sets error state
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <SweetAlert
          show={error}
          title="Error"
          text={error}
          onConfirm={() => setError(false)}
        />
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="UserName"
                name="username"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordCheck"
                label="Password Check"
                type="password"
                onChange={handleInputChange}
                id="password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </Container>
  );
}
