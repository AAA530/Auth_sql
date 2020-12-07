import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Home from "./components/Pages/Home";
import Axios from "axios";

import { UserContext, UserProvider } from "./Context/UserContext";
import AuthPath from "./components/Pages/AuthPath";

import "./App.css";

function App() {
  //defining state for storeing user data
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Checking if user is logged in
    const checkLoggedin = async () => {
      try {
        //Get Auth token form local storage to check if it is valid
        let token = localStorage.getItem("auth-token");
        if (token === null) {
          localStorage.setItem("auth-token", "");
          token = ""; //setting token value to null
        }

        //checking if token id valid
        const tokenRes = await Axios.post(
          "http://localhost:5000/users/tokenIsValid",
          null,
          { headers: { "x-auth-token": token } }
        );

        if (tokenRes) {
          const userRes = await Axios.get("http://localhost:5000/users", {
            headers: { "x-auth-token": token },
          });
          console.log(userRes);
          //Setting User Data
          setUserData({
            token,
            user: userRes.data,
          });
        }

        console.log(tokenRes.data);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedin();
  }, []);

  return (
    <>
      {loading ? (
        <p>loading</p>
      ) : (
        <BrowserRouter>
          <UserContext.Provider value={{ userData, setUserData }}>
            <Header />
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/" component={AuthPath} />
            </Switch>
          </UserContext.Provider>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
