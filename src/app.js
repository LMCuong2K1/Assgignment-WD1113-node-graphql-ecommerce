const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger/swagger");
const { expressMiddleware } = require("@apollo/server/express4");
const createApolloServer = require("./graphql");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));

// REST API Routes
app.use("/api", require("./routes/index"));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// GraphQL initialization will be done asynchronously before starting the server
app.setupGraphQL = async () => {
  const server = createApolloServer();
  await server.start();
  app.use(
    "/graphql",
    (req, res, next) => { req.body = req.body || {}; next() },
    expressMiddleware(server, {
      context: async ({ req }) => {
        let user = null;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
          try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await User.findById(decoded.id);
          }
          catch (err) {
            throw new Error("Invalid authentication token");
          }
        }
        return { req, user };
      },
    }),
  );
};

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
