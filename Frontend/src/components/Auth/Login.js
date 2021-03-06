import React, { useState, useContext } from "react";

// importing Material ui components
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

// SweetAlert is used to show error in login form
import SweetAlert from "sweetalert2-react";

import { useHistory } from "react-router-dom";
import Axios from "axios";

// importing UserContext to get userData from it
import { UserContext } from "../../Context/UserContext";

export default function Login() {
  const [obj, setObj] = useState({}); // obj will store form data
  const [error, setError] = useState(false); // To store error coming from node server

  const { userData, setUserData } = useContext(UserContext);

  const history = useHistory();

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
      let logUser = obj;

      // Requesting node backend to login , it will return error if credentials are not right
      const loginres = await Axios.post("http://localhost:5000/users/login", {
        username: logUser.username,
        password: logUser.password,
      });

      // Sets UserData to be used in app
      setUserData({
        token: loginres.data.token,
        user: loginres.data.user,
      });

      //Set AUTH Token to localStorage so person does not have to login every time
      localStorage.setItem("auth-token", loginres.data.token);
      history.push("/home");
    } catch (err) {
      // If there is error in form submission it sets error state
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  //Styles
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
      width: "100%",
      marginTop: theme.spacing(1),
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
          Log in
        </Typography>
        <SweetAlert
          show={error}
          title="Error"
          text={error}
          onConfirm={() => setError(false)}
        />
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username1"
            label="UserName"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password1"
            autoComplete="current-password"
            onChange={handleInputChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}
