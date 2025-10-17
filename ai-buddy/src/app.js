const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

// app.use("/api/ai-buddy", routes);

module.exports = app;