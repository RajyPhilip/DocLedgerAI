const express = require("express");

const healthRoutes = require("./routes/health.route");

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);

module.exports = app;
