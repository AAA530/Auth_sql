// const Users = require("../models/user.model");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");

const jwt = require("jsonwebtoken");
const Router = require("express").Router();
const Auth = require("./../middleware/auth");

//Connecting to mySQL database
const db = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root",
});

// Creating Database Schema if it is not already present
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to mysql");
    db.query("CREATE DATABASE IF NOT EXISTS auth_node_sql", (err, result) => {
      if (err) throw err;
      db.query("USE auth_node_sql", (err, r_d) => {
        if (err) throw err;
        db.query(
          "CREATE TABLE IF NOT EXISTS `users`( `id` INT NOT NULL AUTO_INCREMENT , `username` VARCHAR(50) NOT NULL , `password` VARCHAR(500) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;",
          (err, r_d) => {
            if (err) throw err;
            console.log(r_d);
          }
        );
      });
    });
  }
});

//======================================================================================================//
//	Route for Registering User
//======================================================================================================//
Router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    // Checking inputs
    if (!data.username || !data.password || !data.passwordCheck) {
      return res.status(400).json({ msg: "Not all fields are there" });
    }
    // Checking Password length
    if (data.password.length < 5) {
      return res.status(400).json({ msg: "Enter password of 5 letters" });
    }
    // Comparing Password and PasswordCheck
    if (data.password !== data.passwordCheck) {
      return res.status(400).json({ msg: "Password did not match" });
    }

    //Running Query To check if user is already registered
    db.query(
      "SELECT username FROM users WHERE username = ?",
      data.username,
      async (err, res_data) => {
        if (err) {
          console.log(err);
        } else {
          if (res_data.length > 0) {
            return res.status(400).json({ msg: "Account already exists" });
          } else {
            //Encrypting Password to save in database
            const salt = await bcrypt.genSalt();
            const PassWordHash = await bcrypt.hash(data.password, salt);
            console.log(PassWordHash);

            const newUser = {
              username: data.username,
              password: PassWordHash,
            };

            // If user is not present insert user in database
            db.query("INSERT INTO users SET ?", newUser, (err, ndata) => {
              console.log(ndata);
              res.json(ndata);
            });
          }
        }
      }
    );
  } catch (err) {
    //if error return error
    return res.status(500).json({ err });
  }
});

//======================================================================================================//
//	Route for Login
//======================================================================================================//
Router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    // Validating request
    if (!username || !password) {
      return res.status(400).json({ msg: "Not all fields are there" });
    }

    //Query to log in user
    db.query(
      "SELECT * FROM users WHERE username = ?",
      username,
      async (err, user) => {
        if (err) {
          console.log(err);
        } else {
          console.log(user);
          if (user.length > 0) {
            //checking password hash with bcrypt
            const isMatch = await bcrypt.compare(password, user[0].password);
            if (!isMatch) {
              //if no match return error msg "Check Your Password again"
              return res.status(400).json({
                msg: "Check Your Password again",
              });
            } else {
              // Signing a jwt token with id
              const token = jwt.sign(
                { id: user[0].id },
                process.env.JWT_SECRET
              );

              // return userData to frontend
              return res.json({
                token: token,
                user: user[0],
              });
            }
          } else {
            return res.status(400).json({
              msg: "No account with this username has been registered.",
            });
          }
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ err });
  }
});

//======================================================================================================//
//	Route for jwt token validation
//======================================================================================================//
Router.post("/tokenIsValid", async (req, res) => {
  // Route to check if JWT token is valid or not
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);
    db.query("SELECT * FROM users WHERE id = ?", verified.id, (err, user) => {
      if (!(user.length > 0)) return res.json(false);
      else {
        return res.json(true);
      }
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
});

//======================================================================================================//
//	Route to get User Data
//======================================================================================================//
Router.get("/", Auth, (req, res) => {
  // Getting User data
  db.query("SELECT * FROM users WHERE id = ?", req.user, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      console.log("in");
      return res.json(data[0]);
    }
  });
});

module.exports = Router;
