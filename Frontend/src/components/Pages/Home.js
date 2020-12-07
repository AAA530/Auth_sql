import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

// importing Material ui components
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { UserContext } from "../../Context/UserContext";

const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: 500,
  },
});

function Home() {
  const { userData } = useContext(UserContext); //getting Data form UserContext
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const classes = useStyles();

  //Checking if User is Logged in , if not then send him to login page
  useEffect(() => {
    if (!userData.user) history.push("/");
    setLoading(false);
  });

  return (
    <>
      {loading ? (
        <p>Loading</p>
      ) : (
        <Grid xs="12">
          <Typography align="center" variant="h4" gutterBottom>
            Wellcome {userData.user.username}
          </Typography>
        </Grid>
      )}
    </>
  );
}

export default Home;
