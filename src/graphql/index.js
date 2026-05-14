const { ApolloServer } = require("@apollo/server");
const categorySchema = require("./schemas/categorySchema");
const productSchema = require("./schemas/productSchema");
const cartSchema = require("./schemas/cartSchema");
const orderSchema = require("./schemas/orderSchema");
const userSchema = require("./schemas/userSchema");
const reviewSchema = require("./schemas/reviewSchema");
// Placeholder for typeDefs and resolvers
// You will merge schemas and resolvers from their respective folders here
const typeDefs = [
  userSchema.typeDefs,
  categorySchema.typeDefs,
  productSchema.typeDefs,
  cartSchema.typeDefs,
  orderSchema.typeDefs,
  reviewSchema.typeDefs,
];

const resolvers = [
  userSchema.resolvers,
  categorySchema.resolvers,
  productSchema.resolvers,
  cartSchema.resolvers,
  orderSchema.resolvers,
  reviewSchema.resolvers,
];

const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};

module.exports = createApolloServer;
