const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send("Backend Server is Running 🚀");
});

app.use("/api/auth", authRoutes);

module.exports = app;