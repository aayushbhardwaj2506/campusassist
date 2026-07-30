const express = require("express");
const cors = require("cors");

const visitRoutes = require("./routes/visitRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CampusAssist Backend is running 🚀");
});

app.use("/api/visits", visitRoutes);

module.exports = app;