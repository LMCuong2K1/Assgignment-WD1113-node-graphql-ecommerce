const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopOnline E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for the ShopOnline E-Commerce platform (REST & GraphQL)',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ── User ──
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665a1b2c3d4e5f6a7b8c9d0e' },
            name: { type: 'string', example: 'Nguyen Van A' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            phone: { type: 'string', example: '0901234567' },
            address: { type: 'string', example: '123 Nguyen Hue, HCM' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, example: 'Nguyen Van A' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                token: { type: 'string' },
              },
            },
          },
        },
        UpdateProfileInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Nguyen Van B' },
            phone: { type: 'string', example: '0909876543' },
            address: { type: 'string', example: '456 Le Loi, HCM' },
            password: { type: 'string', minLength: 6, example: 'newpass123' },
          },
        },
        UpdateUserByAdminInput: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] },
            phone: { type: 'string' },
            address: { type: 'string' },
          },
        },
        // ── Category ──
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Điện thoại' },
            description: { type: 'string', example: 'Danh mục điện thoại di động' },
            slug: { type: 'string', example: 'dien-thoai' },
            parent: { type: 'string', nullable: true },
            children: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateCategoryInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Điện thoại' },
            description: { type: 'string', example: 'Danh mục điện thoại' },
            parent: { type: 'string', description: 'Parent category ID', example: '665a...' },
          },
        },
        UpdateCategoryInput: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            parent: { type: 'string', nullable: true },
            isActive: { type: 'boolean' },
          },
        },
        // ── Product ──
        ProductImage: {
          type: 'object',
          properties: {
            url: { type: 'string', example: 'https://example.com/img.jpg' },
            public_id: { type: 'string', example: 'products/img1' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'iPhone 15 Pro' },
            description: { type: 'string' },
            price: { type: 'number', example: 29990000 },
            stock: { type: 'integer', example: 100 },
            category: { type: 'string' },
            images: { type: 'array', items: { $ref: '#/components/schemas/ProductImage' } },
            isActive: { type: 'boolean' },
            slug: { type: 'string', example: 'iphone-15-pro' },
            sku: { type: 'string', example: 'IP15PRO-001' },
            rating: { type: 'number', example: 4.5 },
            numReviews: { type: 'integer', example: 12 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateProductInput: {
          type: 'object',
          required: ['name', 'description', 'price', 'stock', 'category', 'sku'],
          properties: {
            name: { type: 'string', example: 'iPhone 15 Pro' },
            description: { type: 'string', example: 'Flagship smartphone' },
            price: { type: 'number', example: 29990000 },
            stock: { type: 'integer', example: 100 },
            category: { type: 'string', example: '665a...' },
            sku: { type: 'string', example: 'IP15PRO-001' },
            images: { type: 'array', items: { $ref: '#/components/schemas/ProductImage' } },
          },
        },
        UpdateProductInput: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            category: { type: 'string' },
            images: { type: 'array', items: { $ref: '#/components/schemas/ProductImage' } },
            isActive: { type: 'boolean' },
          },
        },
        // ── Review ──
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            product: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', example: 'Sản phẩm rất tốt!' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateReviewInput: {
          type: 'object',
          required: ['rating'],
          properties: {
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', example: 'Sản phẩm tuyệt vời!' },
          },
        },
        // ── Cart ──
        CartItem: {
          type: 'object',
          properties: {
            product: { type: 'string' },
            quantity: { type: 'integer', minimum: 1, example: 2 },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AddToCartInput: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string', example: '665a...' },
            quantity: { type: 'integer', minimum: 1, example: 1 },
          },
        },
        UpdateCartItemInput: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string', example: '665a...' },
            quantity: { type: 'integer', minimum: 1, example: 3 },
          },
        },
        // ── Order ──
        OrderItem: {
          type: 'object',
          properties: {
            product: { type: 'string' },
            quantity: { type: 'integer', example: 2 },
            price: { type: 'number', example: 29990000 },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            totalPrice: { type: 'number', example: 59980000 },
            status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered'], example: 'pending' },
            shippingAddress: { type: 'string', example: '123 Nguyen Hue, HCM' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateOrderInput: {
          type: 'object',
          required: ['shippingAddress'],
          properties: {
            shippingAddress: { type: 'string', example: '123 Nguyen Hue, HCM' },
          },
        },
        UpdateOrderStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered'], example: 'processing' },
          },
        },
        // ── Common ──
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Đăng ký, đăng nhập, quản lý người dùng' },
      { name: 'Categories', description: 'Quản lý danh mục sản phẩm' },
      { name: 'Products', description: 'Quản lý sản phẩm' },
      { name: 'Reviews', description: 'Đánh giá sản phẩm' },
      { name: 'Cart', description: 'Giỏ hàng' },
      { name: 'Orders', description: 'Đơn hàng' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
