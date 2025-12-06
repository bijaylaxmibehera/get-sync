const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config({});
const cors = require("cors");

app.listen(process.env.PORT, () => {
  console.log(`Server running on ` + process.env.PORT)
})
