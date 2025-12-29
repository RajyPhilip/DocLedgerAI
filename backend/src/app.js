require("dotenv").config({ path: ".env.development" });

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const documentsRoutes = require("./routes/documents.routes");
const processingRoutes = require("./routes/processing.routes");

const app = express();

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// ================= ROUTES =================
app.use("/auth", authRoutes);
app.use("/documents", documentsRoutes);

app.use(processingRoutes);

module.exports = app;
