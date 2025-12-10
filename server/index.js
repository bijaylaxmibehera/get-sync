const express = require("express");
const connectDB = require("./src/config/database");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config({});
const cors = require("cors");
const http = require("http");
const initializeSocket = require('./src/utils/socket');

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS for local frontend + Vercel deployment
const allowedOrigins = [
  "http://localhost:5173",  
  process.env.FRONTEND_URL, 
]
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With"
    ],
  })
);



// Routes
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
  res.json({ 
    message: "Backend running on Vercel!", 
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Export for Vercel serverless
module.exports = app;

// Local development server ONLY
if (require.main === module) {
  connectDB().then(() => {
    const server = http.createServer(app);
    initializeSocket(server);
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
    });
  }).catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
}
