require("dotenv").config();
require("express-async-errors");
// async errors

const express = require("express");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");
const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send('<h1>Store api</h1><a href="/api/v1/products">products</a>');
});

app.use("/api/v1/products", productsRouter);
// products route

app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    // connect db
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`server is listening at port ${port}`);
    });
  } catch (error) {}
};

start();
