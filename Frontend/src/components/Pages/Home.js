import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
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
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const classes = useStyles();

  console.log(userData);
  useEffect(() => {
    if (!userData.user) history.push("/");
    setLoading(false);
  });

  return (
    <>
      {loading ? (
        <p>hi</p>
      ) : (
        <Grid xs="12">
          <Typography align="center" variant="h4" gutterBottom>
            Wellcome {userData.user.email}
          </Typography>
        </Grid>
      )}
    </>

    // {loading
    //   ? <p>hi</p>
    //   : <Grid xs="12">
    //   <Typography align="center" variant="h4" gutterBottom>
    //     Wellcome {userData.user.email}
    //   </Typography>
    // </Grid>
    // }

    // <Grid xs="12">
    //   <Typography align="center" variant="h4" gutterBottom>
    //     Wellcome {userData.user.email}
    //   </Typography>
    // </Grid>
  );
}

export default Home;
