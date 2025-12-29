require("dotenv").config({ path: ".env.development" });

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/documents", require("./routes/documents.routes"));

module.exports = app;
