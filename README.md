# ShopOnline – Backend API

This is the backend API for the ShopOnline E-Commerce website. It provides both REST API and GraphQL endpoints.

## Tech Stack
- **Node.js** & **Express.js**
- **Apollo Server** (GraphQL)
- **MongoDB** & **Mongoose**
- **JWT** & **Bcryptjs** for Authentication
- **Swagger UI** for REST API documentation
- **Zod** for Data Validation

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Setup:
   Copy `.env.example` to `.env` and configure your variables:
   ```bash
   cp .env.example .env
   ```
   *Make sure to provide your `MONGO_URI` and `JWT_SECRET`.*

3. Seed the Database (Optional):
   ```bash
   npm run seed
   ```

4. Start the Server:
   - For Development (with Nodemon):
     ```bash
     npm run dev
     ```
   - For Production:
     ```bash
     npm start
     ```

## Endpoints
- **REST API Docs (Swagger):** `http://localhost:5000/api-docs`
- **GraphQL API (Apollo Sandbox):** `http://localhost:5000/graphql`

## Project Structure
```text
src/
├── config/         # DB, JWT, Swagger config
├── controllers/    # REST controllers
├── routes/         # REST routes
├── graphql/
│   ├── schemas/    # GraphQL typeDefs
│   ├── resolvers/  # GraphQL resolvers
│   └── index.js    # ApolloServer setup
├── models/         # Mongoose schemas
├── middlewares/    # Auth, Validation, Error Handling
├── utils/          # Helper functions (e.g., seed.js)
├── swagger/        # Swagger configuration
├── app.js          # Express app configuration
└── server.js       # Main server entry point
```