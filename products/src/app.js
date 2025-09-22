const cookieParser = require("cookie-parser");
const express = require("express")
const app = express();
const productsRouter = require("./routes/products.routes")

app.use(express.json())
app.use(cookieParser());

app.use("/api/products", productsRouter);

module.exports = app;