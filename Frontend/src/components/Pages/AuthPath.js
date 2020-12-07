import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import { UserContext } from "../../Context/UserContext";

export default function AuthPath() {
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (userData.user) history.push("/home");
    setLoading(false);
  });
  return (
    <>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ minHeight: "90vh" }}
      >
        <Grid
          container
          item
          md={6}
          xs={12}
          direction="column"
          alignItems="center"
          style={{
            minHeight: "90vh",
          }}
        >
          <Grid item container direction="column" xs={12} alignItems="center">
            <Login />
          </Grid>
        </Grid>
        <Grid
          container
          item
          md={6}
          xs={12}
          direction="column"
          alignItems="center"
          style={{
            minHeight: "90vh",
          }}
        >
          <Grid item container direction="column" xs={12} alignItems="center">
            <Register />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
