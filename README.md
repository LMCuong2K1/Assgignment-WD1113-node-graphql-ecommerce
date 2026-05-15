# ShopOnline – Backend API

This is the backend API for the ShopOnline E-Commerce website. It provides both REST API and GraphQL endpoints.

## Tech Stack
- **Node.js** & **Express.js**
- **Apollo Server** (GraphQL)
- **MongoDB** & **Mongoose**
- **JWT** & **Bcryptjs** for Authentication
- **Swagger UI** for REST API documentation
- **Zod** for Data Validation
- **Winston** for Logging
- **Helmet**, **Cors**, **Express Rate Limit** for Security

## Features

### REST API
- User Authentication (Register, Login, Profile Management)
- Category Management (CRUD)
- Product Management (CRUD with filtering, pagination, search)
- Shopping Cart (Add, Update, Remove items, Clear cart)
- Order Management (Create, View orders, Update order status - Admin)
- Product Reviews (Create, Read, Delete)

### GraphQL API
- Full User management (Register, Login, Profile update, Admin user listing)
- Category CRUD operations
- Product CRUD operations with filtering and pagination
- Cart management operations
- Order management with status updates
- Review operations (Create, Update, Delete)

### Documentation
- Interactive Swagger UI at `/api-docs` for REST API testing
- GraphQL Playground at `/graphql` for testing queries and mutations

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

3. Seed the Database (Optional but recommended for testing):
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

## API Endpoints

### REST API Documentation
Access the interactive API documentation at: `http://localhost:5000/api-docs`

### GraphQL Playground
Test GraphQL queries and mutations at: `http://localhost:5000/graphql`

#### Sample Queries:
```graphql
# Get current user profile
query {
  me {
    _id
    name
    email
    role
  }
}

# Get all users (Admin only)
query {
  users {
    _id
    name
    email
    role
  }
}

# Get products with filtering and pagination
query {
  products(pagination: { page: 1, limit: 10, search: "iPhone" }) {
    products {
      _id
      name
      price
      stock
      category {
        name
      }
    }
    count
  }
}

# Get user's cart
query {
  getCart {
    _id
    items {
      product {
        _id
        name
        price
      }
      quantity
    }
  }
}

# Get user's orders
query {
  myOrders {
    _id
    totalPrice
    status
    createdAt
    items {
      product {
        name
      }
      quantity
      price
    }
  }
}
```

#### Sample Mutations:
```graphql
# Register a new user
mutation {
  register(input: {
    name: "John Doe"
    email: "john@example.com"
    password: "securepassword123"
  }) {
    user {
      _id
      name
      email
    }
    token
  }
}

# Login
mutation {
  login(input: {
    email: "john@example.com"
    password: "securepassword123"
  }) {
    user {
      _id
      name
      email
    }
    token
  }
}

# Create a product (Admin only)
mutation {
  createProduct(input: {
    name: "Test Product"
    description: "This is a test product"
    price: 100000
    stock: 50
    category: "665a1b2c3d4e5f6a7b8c9d0e"  # Category ID
    sku: "TEST-001"
  }) {
    _id
    name
    price
    stock
  }
}

# Add item to cart
mutation {
  addToCart(input: {
    productId: "665a1b2c3d4e5f6a7b8c9d0f"  # Product ID
    quantity: 2
  }) {
    _id
    items {
      product {
        _id
        name
      }
      quantity
    }
  }
}
```

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

## Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/ecommerce |
| JWT_SECRET | Secret key for JWT signing | your_jwt_secret_key_here |
| JWT_EXPIRES_IN | JWT expiration time | 1d |

## Testing the API
1. Start the development server: `npm run dev`
2. Visit `http://localhost:5000/api-docs` for REST API testing
3. Visit `http://localhost:5000/graphql` for GraphQL testing
4. Use the seed data to populate the database with sample users, products, categories, etc.

## Default Admin Credentials (after seeding)
- Email: admin@shoponline.com
- Password: admin123

## Default User Credentials (after seeding)
- Email: nguyenvana@gmail.com
- Password: user12345

## API Response Format
All API responses follow a consistent format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Populate database with sample data