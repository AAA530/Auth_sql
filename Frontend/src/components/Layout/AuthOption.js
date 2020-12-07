import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

import Button from "@material-ui/core/Button";

function AuthOption() {
  const history = useHistory();
  const { userData, setUserData } = useContext(UserContext);

  const logout = () => {
    //Setting Data on Context to null
    setUserData({
      token: undefined,
      user: undefined,
    });

    // Removing Auth-token from localStorage
    localStorage.setItem("auth-token", "");
    // Redirecting to login page
    history.push("/");
  };

  return (
    <>
      {userData.token ? (
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      ) : (
        <></>
      )}
    </>
  );
}

export default AuthOption;
