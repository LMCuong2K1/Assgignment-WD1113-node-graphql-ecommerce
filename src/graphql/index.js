const { ApolloServer } = require("@apollo/server");
const categorySchema = require("./schemas/categorySchema");
const productSchema = require("./schemas/productSchema");
const cartSchema = require("./schemas/cartSchema");
const orderSchema = require("./schemas/orderSchema");
// Placeholder for typeDefs and resolvers
// You will merge schemas and resolvers from their respective folders here
const typeDefs = [
  categorySchema.typeDefs,
  productSchema.typeDefs,
  cartSchema.typeDefs,
  orderSchema.typeDefs,
];

const resolvers = [
  categorySchema.resolvers,
  productSchema.resolvers,
  cartSchema.resolvers,
  orderSchema.resolvers,
];

const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};

module.exports = createApolloServer;
