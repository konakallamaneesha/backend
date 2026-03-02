const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

app.use(cors());
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// DB connect later
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err.message));