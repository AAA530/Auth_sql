import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Header from "./components/Layout/Header";
import Home from "./components/Pages/Home";
import Axios from "axios";

import "./App.css";
// import UserContext from "./Context/UserContext";
import { UserContext, UserProvider } from "./Context/UserContext";
import AuthPath from "./components/Pages/AuthPath";
// const UserContext = createContext();

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedin = async () => {
      try {
        let token = localStorage.getItem("auth-token");
        if (token === null) {
          localStorage.setItem("auth-token", "");
          token = "";
        }
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
