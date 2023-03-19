const ProductModel = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await ProductModel.find({});
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  // this way we wont get empty array in return if query params doesnt exist
  const { featured, company, name } = req.query;
  // if user isnt looking for queries that in the schema,
  // then we will use Model.Find({}) with empty object and get all items back
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  const products = await ProductModel.find(queryObject);
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
