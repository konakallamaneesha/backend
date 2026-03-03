const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

app.use(cors({
  origin: "https://securevaultfrontend.vercel.app",
  credentials: true
}));
app.use(express.json());

// Routes first load
app.use("/api/auth", authRoutes);
app.use("/api/passwords", passwordRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Server start first
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log("MongoDB Error:", err.message));