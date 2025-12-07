const express = require("express");
const connectDB = require("./src/config/database");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config({});
const cors = require("cors");
const http=require("http")
const initializeSocket = require('./src/utils/socket')


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const server=http.createServer(app)
initializeSocket(server)
// connect DB once
// connectDB();

//routes
const authRouter = require("./src/routes/auth.routes");
const profileRouter = require("./src/routes/profile.routes");
const requestRouter = require("./src/routes/request.routes");
const userRouter = require("./src/routes/user.routes");
const chatRouter = require("./src/routes/chat.routes");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);


app.get("/", (req, res) => {
  res.send("Backend running on Vercel!");
});


// Export for Vercel
module.exports = app;


// Local development server ONLY
if (require.main === module) {
  const connectDB = require("./src/config/database");
  connectDB(); 
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
