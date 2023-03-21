const ProductModel = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await ProductModel.find({});
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  // this way we wont get empty array in return if query params doesnt exist
  const { featured, company, name, sort, fields, numericFilters } = req.query;
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
  if (numericFilters) {
    // transform to user friendly expressions to mongoose expressions with regexp
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eg",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(regEx, (match) => {
      return `-${operatorMap[match]}-`;
    });
    // options on which we can use numeric filters
    const options = ["price", "rating"];
    // since in api can be 2 filters for numeric values, we can split it
    filters = filters.split(",").forEach((item) => {
      // split the item, since it will be in this format(price-$gt-40)
      const [field, operator, value] = item.split("-");
      // check if field in options , if it is then all ok
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = ProductModel.find(queryObject);
  // sort
  if (sort) {
    // split and join together if there is more than 1 sort query(e.g. name,price)
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    // if sort not provided then just sort by something by default
    result = result.sort("createdAt");
  }
  // select fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  // Pagination, page and limit
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  // skip to implement pagination logic, if we on page 2, then we skip first 10 items
  // so we displaying next 10 items for page 2
  const skip = (page - 1) * limit;
  result = result.limit(limit).skip(skip);
  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
