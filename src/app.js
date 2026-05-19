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
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
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
const swaggerCustomOptions = {
  customJsStr: `
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);
      const url = args[0] instanceof Request ? args[0].url : args[0];
      if (url.includes('/api/auth/login') && response.ok) {
        try {
          const clone = response.clone();
          const resData = await clone.json();
          if (resData.data && resData.data.token) {
            window.ui.authActions.authorize({
              bearerAuth: {
                name: 'bearerAuth',
                schema: { type: 'http', in: 'header', name: 'Authorization', scheme: 'bearer' },
                value: resData.data.token
              }
            });
            setTimeout(() => alert("✅ Tự động gắn Token thành công! Bạn không cần copy-paste nữa, hãy test luôn các API khác!"), 300);
          }
        } catch(e) { console.error(e) }
      }
      return response;
    };
  `
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerCustomOptions));

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
        if (req.headers.authorization) {
          try {
            const token = req.headers.authorization.startsWith("Bearer")
              ? req.headers.authorization.split(" ")[1]
              : req.headers.authorization;
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
  const statusCode = err.statusCode || err.status || 500;
  logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`, err);
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  });
});

module.exports = app;
