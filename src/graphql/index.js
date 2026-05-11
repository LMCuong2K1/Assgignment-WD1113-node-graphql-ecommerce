const { ApolloServer } = require('@apollo/server');
const categorySchema = require('./schemas/categorySchema');

// Placeholder for typeDefs and resolvers
// You will merge schemas and resolvers from their respective folders here
const typeDefs = [
  categorySchema.typeDefs
];

const resolvers = [
  categorySchema.resolvers
];

const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};

module.exports = createApolloServer;
