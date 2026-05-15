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
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");
// Middlewares
app.use(express.json());
app.set("trust proxy", 1);
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  message: {
    success: false,
    message: "Hệ thống bận. Vui lòng thử lại sau!",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Health Check Route (không cần auth)
app.use("/health", require("./routes/healthRoutes"));

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
    (req, res, next) => {
      req.body = req.body || {};
      next();
    },
    expressMiddleware(server, {
      context: async ({ req }) => {
        let user = null;
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
        ) {
          try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await User.findById(decoded.id);
          } catch (err) {
            // Token sai/hết hạn → user = null, để resolver tự kiểm tra quyền
            user = null;
          }
        }
        return { req, user };
      },
    }),
  );
};

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`, err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
