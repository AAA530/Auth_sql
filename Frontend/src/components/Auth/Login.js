import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import SweetAlert from "sweetalert2-react";

import { useHistory } from "react-router-dom";

import { UserContext, UserProvider } from "../../Context/UserContext";

import Axios from "axios";

export default function Login() {
  const [obj, setObj] = useState({});
  const [error, setError] = useState(false);

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

      const loginres = await Axios.post("http://localhost:5000/users/login", {
        email: logUser.email,
        password: logUser.password,
      });

      setUserData({
        token: loginres.data.token,
        user: loginres.data.user,
      });

      localStorage.setItem("auth-token", loginres.data.token);
      history.push("/home");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  console.log(obj);
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            id="password"
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
