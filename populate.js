require("dotenv").config();

const connectDB = require("./db/connect");
const ProductModel = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // delete all product data in db
    await ProductModel.deleteMany();
    // create products by populating our db from json file
    await ProductModel.create(jsonProducts);
    console.log("success");
    // stop process
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
