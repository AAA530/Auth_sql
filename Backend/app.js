const express = require("express");
// const mysql = require("mysql");
const cors = require("cors");
const UserRoutes = require("./routes/usersRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", UserRoutes);

const port = 5000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is started on port :${port}`);
});
