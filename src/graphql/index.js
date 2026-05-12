const { ApolloServer } = require("@apollo/server");
const categorySchema = require("./schemas/categorySchema");
const productSchema = require("./schemas/productSchema");
const cartSchema = require("./schemas/cartSchema");
// Placeholder for typeDefs and resolvers
// You will merge schemas and resolvers from their respective folders here
const typeDefs = [
  categorySchema.typeDefs,
  productSchema.typeDefs,
  cartSchema.typeDefs,
];

const resolvers = [
  categorySchema.resolvers,
  productSchema.resolvers,
  cartSchema.resolvers,
];

const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};

module.exports = createApolloServer;
