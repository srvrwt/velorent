const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bikeRoutes = require("./routes/bikeRoutes");

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



// SERVE UPLOADED FILES


app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);



// ROUTES


app.get("/", (req, res) => {
  res.send("Backend Server is Running 🚀");
});

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/bikes", bikeRoutes);


module.exports = app;