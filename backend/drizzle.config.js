const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, ".env.development"),
});

module.exports = {
  schema: "./src/db/schema/**/*.js",
  out: "./src/db/migrations",
  dialect: "postgresql",

  dbCredentials: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false, 
  },
};
