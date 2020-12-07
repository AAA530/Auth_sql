// const Users = require("../models/user.model");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");

const jwt = require("jsonwebtoken");
const Router = require("express").Router();
const Auth = require("./../middleware/auth");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auth_node_sql",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to mysql");
  }
});

//======================================================================================================//
//	Route for Registering User
//======================================================================================================//
Router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    if (!data.email || !data.password || !data.passwordCheck) {
      return res.status(400).json({ msg: "Not all fields are there" });
    }
    if (data.password.length < 5) {
      return res.status(400).json({ msg: "Enter password of 5 letters" });
    }
    if (data.password !== data.passwordCheck) {
      return res.status(400).json({ msg: "Password did not match" });
    }

    let sql = "SELECT email FROM users WHERE email = ?";
    db.query(sql, data.email, async (err, res_data) => {
      if (res_data.length > 0) {
        return res.status(400).json({ msg: "Account already exists" });
      } else {
        const salt = await bcrypt.genSalt();
        const PassWordHash = await bcrypt.hash(data.password, salt);
        console.log(PassWordHash);

        const newUser = {
          email: data.email,
          password: PassWordHash,
        };

        let sql2 = "INSERT INTO users SET ?";
        db.query(sql2, newUser, (err, ndata) => {
          console.log(ndata);
          res.json(ndata);
        });
      }
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
});

//======================================================================================================//
//	Route for Login
//======================================================================================================//
Router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Not all fields are there" });
    }

    let sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, email, async (err, user) => {
      console.log(user);
      if (user.length > 0) {
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
          return res.status(400).json({
            msg: "Check Your Password again",
          });
        } else {
          const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET);

          return res.json({
            token: token,
            user: user[0],
          });
        }
      } else {
        return res.status(400).json({
          msg: "No account with this email has been registered.",
        });
      }
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
});

//======================================================================================================//
//	Route for jwt token validation
//======================================================================================================//
Router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    console.log(verified.id + "****");
    // let user;
    console.log("----");
    // const user1 = db.query("SELECT * FROM users WHERE id = ?", 1);
    // console.log(user1);
    db.query("SELECT * FROM users WHERE id = ?", verified.id, (err, user) => {
      if (!(user.length > 0)) return res.json(false);
      else {
        return res.json(true);
      }
    });
    // console.log(user);
  } catch (err) {
    return res.status(500).json({ err });
  }
});

//======================================================================================================//
//	Route to get User Data
//======================================================================================================//
Router.get("/", Auth, (req, res) => {
  console.log("in");
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
