const swaggerJsdoc = require('swagger-jsdoc');

const idExample = '665a1b2c3d4e5f6a7b8c9d0e';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopOnline E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for the ShopOnline E-Commerce platform (REST & GraphQL)',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Development server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        // ── Auth ──
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Nguyen Van A' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        LoginInput: {
          type: 'object',
          description: 'Admin: admin@shoponline.com / admin123',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@shoponline.com' },
            password: { type: 'string', example: 'admin123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: idExample },
                name: { type: 'string', example: 'Nguyen Van A' },
                email: { type: 'string', example: 'user@example.com' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
              },
            },
          },
        },
        // ── User ──
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: idExample },
            name: { type: 'string', example: 'Nguyen Van A' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            phone: { type: 'string', example: '0901234567' },
            address: { type: 'string', example: '123 Nguyen Hue, HCM' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UpdateProfileInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Nguyen Van B' },
            phone: { type: 'string', example: '0909876543' },
            address: { type: 'string', example: '456 Le Loi, HCM' },
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
            password: { type: 'string', minLength: 6 },
          },
        },
        // ── Category ──
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: idExample },
            name: { type: 'string', example: 'Điện thoại' },
            description: { type: 'string', example: 'Danh mục điện thoại di động' },
            slug: { type: 'string', example: 'dien-thoai' },
            parent: {
              type: 'object',
              nullable: true,
              properties: {
                _id: { type: 'string', example: idExample },
                name: { type: 'string', example: 'Danh mục cha' },
              },
            },
            children: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string', example: idExample },
                  name: { type: 'string', example: 'Danh mục con' },
                },
              },
            },
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
            parent: { type: 'string', description: 'Category ID cha (nếu có)', example: idExample },
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
            url: { type: 'string', example: 'https://placehold.co/600x400?text=iPhone+15' },
            public_id: { type: 'string', example: 'products/iphone15' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: idExample },
            name: { type: 'string', example: 'iPhone 15 Pro Max' },
            description: { type: 'string', example: 'iPhone 15 Pro Max 256GB, chip A17 Pro' },
            price: { type: 'number', example: 34990000 },
            stock: { type: 'integer', example: 50 },
            category: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: idExample },
                name: { type: 'string', example: 'iPhone' },
              },
            },
            images: { type: 'array', items: { $ref: '#/components/schemas/ProductImage' } },
            isActive: { type: 'boolean', example: true },
            slug: { type: 'string', example: 'iphone-15-pro-max' },
            sku: { type: 'string', example: 'IP15PM-256' },
            rating: { type: 'number', example: 4.5 },
            numReviews: { type: 'integer', example: 12 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ProductListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            count: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 2 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 5 },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' },
            },
          },
        },
        CreateProductInput: {
          type: 'object',
          required: ['name', 'description', 'price', 'stock', 'category', 'sku'],
          properties: {
            name: { type: 'string', example: 'iPhone 15 Pro Max' },
            description: { type: 'string', example: 'Flagship smartphone cao cấp nhất' },
            price: { type: 'number', example: 34990000 },
            stock: { type: 'integer', example: 50 },
            category: { type: 'string', description: 'Category ID', example: idExample },
            sku: { type: 'string', example: 'IP15PM-256' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string', example: 'https://placehold.co/600x400?text=Product' },
                  public_id: { type: 'string', example: 'products/img1' },
                },
              },
            },
            isActive: { type: 'boolean', example: true },
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
            sku: { type: 'string' },
            isActive: { type: 'boolean' },
          },
        },
        // ── Review ──
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: idExample },
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: idExample },
                name: { type: 'string', example: 'Nguyen Van A' },
                email: { type: 'string', example: 'user@example.com' },
              },
            },
            product: { type: 'string', example: idExample },
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
        UpdateReviewInput: {
          type: 'object',
          properties: {
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
            comment: { type: 'string', example: 'Đã cập nhật: chất lượng ổn!' },
          },
        },
        // ── Cart ──
        CartItem: {
          type: 'object',
          properties: {
            product: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: idExample },
                name: { type: 'string', example: 'iPhone 15 Pro Max' },
                price: { type: 'number', example: 34990000 },
                stock: { type: 'integer', example: 50 },
                images: { type: 'array', items: { $ref: '#/components/schemas/ProductImage' } },
                slug: { type: 'string', example: 'iphone-15-pro-max' },
              },
            },
            quantity: { type: 'integer', minimum: 1, example: 2 },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: idExample },
            user: { type: 'string', example: idExample },
            items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AddToCartInput: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string', description: 'Product ID', example: idExample },
            quantity: { type: 'integer', minimum: 1, example: 2 },
          },
        },
        UpdateCartItemInput: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string', description: 'Product ID', example: idExample },
            quantity: { type: 'integer', minimum: 1, example: 3 },
          },
        },
        // ── Order ──
        OrderItem: {
          type: 'object',
          properties: {
            product: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: idExample },
                name: { type: 'string', example: 'iPhone 15 Pro Max' },
                price: { type: 'number', example: 34990000 },
              },
            },
            quantity: { type: 'integer', example: 2 },
            price: { type: 'number', example: 34990000 },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: idExample },
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: idExample },
                name: { type: 'string', example: 'Nguyen Van A' },
                email: { type: 'string', example: 'user@example.com' },
              },
            },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            totalPrice: { type: 'number', example: 69980000 },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              example: 'pending',
            },
            shippingAddress: { type: 'string', example: '123 Nguyen Hue, HCM' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateOrderInput: {
          type: 'object',
          required: ['shippingAddress'],
          properties: {
            shippingAddress: { type: 'string', example: '123 Nguyen Hue, Quan 1, TP.HCM' },
          },
        },
        UpdateOrderStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              example: 'processing',
            },
          },
        },
        // ── Common ──
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Dữ liệu không hợp lệ' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'body.name' },
                  error: { type: 'string', example: 'Tên không được để trống!' },
                },
              },
            },
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
