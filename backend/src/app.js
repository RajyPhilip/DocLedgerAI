require("dotenv").config({ path: ".env.development" });

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const documentsRoutes = require("./routes/documents.routes");

const app = express();

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

//Routes
app.use("/auth", authRoutes);
app.use("/documents", documentsRoutes);

module.exports = app;
