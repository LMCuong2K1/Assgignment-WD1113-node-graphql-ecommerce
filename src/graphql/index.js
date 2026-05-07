const { ApolloServer } = require('@apollo/server');

// Placeholder for typeDefs and resolvers
// You will merge schemas and resolvers from their respective folders here
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL',
  },
};

const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};

module.exports = createApolloServer;
