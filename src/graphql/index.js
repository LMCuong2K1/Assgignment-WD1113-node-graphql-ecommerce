const { ApolloServer } = require("@apollo/server");

// Schemas (typeDefs only)
const categorySchema = require("./schemas/categorySchema");
const productSchema = require("./schemas/productSchema");
const cartSchema = require("./schemas/cartSchema");
const orderSchema = require("./schemas/orderSchema");
const userSchema = require("./schemas/userSchema");
const reviewSchema = require("./schemas/reviewSchema");

// Resolvers
const categoryResolver = require("./resolvers/categoryResolver");
const productResolver = require("./resolvers/productResolver");
const cartResolver = require("./resolvers/cartResolver");
const orderResolver = require("./resolvers/orderResolver");
const userResolver = require("./resolvers/userResolver");
const reviewResolver = require("./resolvers/reviewResolver");

const typeDefs = [
  userSchema.typeDefs,
  categorySchema.typeDefs,
  productSchema.typeDefs,
  cartSchema.typeDefs,
  orderSchema.typeDefs,
  reviewSchema.typeDefs,
];

const resolvers = [
  userResolver,
  categoryResolver,
  productResolver,
  cartResolver,
  orderResolver,
  reviewResolver,
];

const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};

module.exports = createApolloServer;
