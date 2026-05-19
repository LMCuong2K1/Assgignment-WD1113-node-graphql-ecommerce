const id = '6a0c8e29a6f713b6f2c1de78';

const specs = {
  openapi: '3.0.0',
  info: {
    title: 'ShopOnline E-Commerce API',
    version: '1.0.0',
    description: `# ShopOnline E-Commerce API

## 🚀 Hướng dẫn Demo

### Chuẩn bị
1. Chạy \`npm run seed\` để tạo dữ liệu mẫu
2. Mở Swagger UI tại http://localhost:5000/api-docs
3. Click nút **Authorize** (ổ khóa 🔓) → dán token → Authorize

### 🔐 Bước 1: Đăng nhập (làm trước)
- **Admin**: email \`admin@shoponline.com\`, password \`admin123\`
- **User**: email \`nguyenvana@gmail.com\`, password \`user12345\`
- Sau khi login, copy token từ response và click **Authorize**

### 📦 Bước 2: Duyệt sản phẩm (không cần login)
- GET \`/api/categories\` → Xem danh mục
- GET \`/api/products\` → Xem tất cả sản phẩm
- GET \`/api/products?search=iphone\` → Tìm kiếm
- GET \`/api/products/:id\` → Xem chi tiết sản phẩm

### 🛒 Bước 3: Giỏ hàng & Đặt hàng (cần login user)
- GET \`/api/cart\` → Xem giỏ hàng (đã có sẵn từ seed)
- POST \`/api/cart/add\` → Thêm sản phẩm
- PUT \`/api/cart/update\` → Cập nhật số lượng
- DELETE \`/api/cart/remove/:productId\` → Xóa sản phẩm
- DELETE \`/api/cart/clear\` → Xóa toàn bộ
- POST \`/api/orders\` → Đặt hàng từ giỏ

### ⭐ Bước 4: Đánh giá (cần login user)
- POST \`/api/products/:id/reviews\` → Tạo đánh giá
- GET \`/api/products/:id/reviews\` → Xem đánh giá
- PUT \`/api/products/:id/reviews/:reviewId\` → Sửa đánh giá
- DELETE \`/api/products/:id/reviews/:reviewId\` → Xóa đánh giá

### 👑 Bước 5: Admin (cần login admin)
- POST \`/api/products\` → Tạo sản phẩm mới
- PUT \`/api/products/:id\` → Cập nhật sản phẩm
- DELETE \`/api/products/:id\` → Xóa sản phẩm (soft delete)
- POST \`/api/categories\` → Tạo danh mục
- PUT \`/api/categories/:id\` → Cập nhật danh mục
- DELETE \`/api/categories/:id\` → Xóa danh mục
- PUT \`/api/orders/:id/status\` → Cập nhật trạng thái đơn hàng
- GET \`/api/orders/all\` → Xem tất cả đơn hàng
- GET \`/api/auth/users\` → Xem tất cả user
- PATCH \`/api/auth/users/:id\` → Cập nhật user

---
**Stack:** Node.js + Express + GraphQL + MongoDB + JWT + Zod + Swagger`,
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
        description: 'Tài khoản test - Admin: admin@shoponline.com / admin123 | User: nguyenvana@gmail.com / user12345',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'nguyenvana@gmail.com' },
          password: { type: 'string', example: 'user12345' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: id },
              name: { type: 'string', example: 'Nguyen Van A' },
              email: { type: 'string', example: 'user@example.com' },
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: id },
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
          name: { type: 'string', example: 'Admin Updated' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'admin' },
          phone: { type: 'string' },
          address: { type: 'string' },
          password: { type: 'string', minLength: 6 },
        },
      },
      // ── Category ──
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: id },
          name: { type: 'string', example: 'Điện thoại' },
          description: { type: 'string', example: 'Danh mục điện thoại di động' },
          slug: { type: 'string', example: 'dien-thoai' },
          parent: {
            type: 'object',
            nullable: true,
            properties: {
              _id: { type: 'string', example: id },
              name: { type: 'string', example: 'Danh mục cha' },
            },
          },
          children: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: id },
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
          parent: { type: 'string', description: 'Category ID cha (nếu có)', example: id },
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
          _id: { type: 'string', example: id },
          name: { type: 'string', example: 'iPhone 15 Pro Max' },
          description: { type: 'string', example: 'iPhone 15 Pro Max 256GB, chip A17 Pro' },
          price: { type: 'number', example: 34990000 },
          stock: { type: 'integer', example: 50 },
          category: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: id },
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
          category: { type: 'string', description: 'Category ID', example: id },
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
          _id: { type: 'string', example: id },
          user: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: id },
              name: { type: 'string', example: 'Nguyen Van A' },
              email: { type: 'string', example: 'user@example.com' },
            },
          },
          product: { type: 'string', example: id },
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
              _id: { type: 'string', example: id },
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
          _id: { type: 'string', example: id },
          user: { type: 'string', example: id },
          items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AddToCartInput: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: { type: 'string', description: 'Product ID', example: id },
          quantity: { type: 'integer', minimum: 1, example: 2 },
        },
      },
      UpdateCartItemInput: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: { type: 'string', description: 'Product ID', example: id },
          quantity: { type: 'integer', minimum: 1, example: 3 },
        },
      },
      // ── Order ─
      OrderItem: {
        type: 'object',
        properties: {
          product: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: id },
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
          _id: { type: 'string', example: id },
          user: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: id },
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
    {
      name: 'Auth',
      description: '🔐 **Scenario 1: Đăng ký & Đăng nhập**\n\nBước 1: POST /register → Tạo tài khoản mới\nBước 2: POST /login → Lấy token (copy vào Authorize 🔓)\nBước 3: GET /profile → Xem thông tin cá nhân\nBước 4: PUT /profile → Cập nhật thông tin\n\n**Credentials:**\n- Admin: `admin@shoponline.com` / `admin123`\n- User: `nguyenvana@gmail.com` / `user12345`',
    },
    {
      name: 'Categories',
      description: '📂 **Scenario 2: Danh mục sản phẩm**\n\nPublic endpoints - không cần đăng nhập.\n\nGET /categories → Xem tất cả danh mục\nGET /categories/:id → Xem chi tiết danh mục',
    },
    {
      name: 'Products',
      description: '📦 **Scenario 3: Sản phẩm & Tìm kiếm**\n\nPublic: GET /products (search, filter, pagination)\nAdmin: POST/PUT/DELETE sản phẩm',
    },
    {
      name: 'Reviews',
      description: '⭐ **Scenario 4: Đánh giá sản phẩm**\n\nPOST /products/:id/reviews → Tạo đánh giá\nGET /products/:id/reviews → Xem đánh giá\nPUT/DELETE → Sửa/Xóa đánh giá của mình',
    },
    {
      name: 'Cart',
      description: '🛒 **Scenario 5: Giỏ hàng**\n\nGET /cart → Xem giỏ hàng (đã có sẵn từ seed)\nPOST /cart/add → Thêm sản phẩm\nPUT /cart/update → Cập nhật số lượng\nDELETE /cart/remove/:id → Xóa sản phẩm\nDELETE /cart/clear → Xóa toàn bộ',
    },
    {
      name: 'Orders',
      description: '📋 **Scenario 6: Đơn hàng**\n\nUser: POST /orders → Đặt hàng từ giỏ, GET /orders → Xem đơn\nAdmin: GET /orders/all → Tất cả đơn, PUT /orders/:id/status → Cập nhật trạng thái',
    },
    {
      name: 'Health',
      description: '🏥 **Health Check**\n\nGET /health → Kiểm tra trạng thái server & database',
    },
  ],
  paths: {
    // ═══════════════════════════════════════════════════════════
    // HEALTH
    // ═══════════════════════════════════════════════════════════
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Kiểm tra sức khỏe server',
        description: 'Trả về trạng thái hoạt động của server, database và thời gian uptime',
        security: [],
        responses: {
          200: {
            description: 'Server hoạt động bình thường',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    uptime: { type: 'number', example: 123.45 },
                    timestamp: { type: 'string', format: 'date-time' },
                    database: {
                      type: 'object',
                      properties: { status: { type: 'string', example: 'connected' } },
                    },
                    version: { type: 'string', example: '1.0.0' },
                  },
                },
              },
            },
          },
          503: {
            description: 'Server gặp sự cố (database không kết nối được)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'degraded' },
                    uptime: { type: 'number' },
                    timestamp: { type: 'string', format: 'date-time' },
                    database: {
                      type: 'object',
                      properties: { status: { type: 'string', example: 'disconnected' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // AUTH
    // ═══════════════════════════════════════════════════════════
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng ký tài khoản mới',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
              example: {
                name: 'Nguyễn Văn Test',
                email: 'test@example.com',
                password: '123456',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Đăng ký thành công',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: {
            description: 'Dữ liệu không hợp lệ',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } },
            },
          },
          409: {
            description: 'Email đã được sử dụng',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập (Dùng chung cho cả Admin & User)',
        description: 'Đăng nhập và nhận JWT token. Token dùng cho các endpoint cần xác thực. Tài khoản test: nguyenvana@gmail.com / user12345 (User) hoặc admin@shoponline.com / admin123 (Admin)',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
              example: {
                email: 'nguyenvana@gmail.com',
                password: 'user12345',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Đăng nhập thành công',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: {
            description: 'Dữ liệu không hợp lệ',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } },
            },
          },
          401: {
            description: 'Email hoặc mật khẩu không đúng',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          429: {
            description: 'Đăng nhập quá nhiều lần',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
    },
    '/api/auth/users': {
      get: {
        tags: ['Auth'],
        summary: 'Lấy danh sách tất cả người dùng (Admin)',
        responses: {
          200: {
            description: 'Lấy danh sách thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền admin' },
        },
      },
    },
    '/api/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Lấy thông tin profile người dùng hiện tại',
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
        },
      },
      put: {
        tags: ['Auth'],
        summary: 'Cập nhật thông tin profile',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProfileInput' },
              example: {
                name: 'Nguyễn Văn A Updated',
                phone: '0901234567',
                address: 'Hà Nội',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cập nhật thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Cập nhật thất bại',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          401: { description: 'Chưa đăng nhập' },
        },
      },
    },
    '/api/auth/users/{id}': {
      patch: {
        tags: ['Auth'],
        summary: 'Admin cập nhật thông tin người dùng',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'User ID',
            example: id,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserByAdminInput' },
              example: {
                name: 'Admin Updated',
                role: 'admin',
                password: 'newpass123',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cập nhật thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          400: { description: 'Cập nhật thất bại' },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền admin' },
          404: { description: 'Không tìm thấy user' },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // CATEGORIES
    // ═══════════════════════════════════════════════════════════
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Lấy danh sách tất cả danh mục',
        security: [],
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Category' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Categories'],
        summary: 'Tạo danh mục mới (Admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCategoryInput' },
              example: {
                name: 'Tablet',
                description: 'Máy tính bảng các loại',
                parent: id,
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Tạo thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Tạo thất bại',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền admin' },
          409: { description: 'Tên danh mục đã tồn tại' },
        },
      },
    },
    '/api/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Lấy chi tiết danh mục theo ID',
        security: [],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID',
            example: id,
          },
        ],
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
          400: { description: 'ID không hợp lệ' },
          404: { description: 'Không tìm thấy danh mục' },
        },
      },
      put: {
        tags: ['Categories'],
        summary: 'Cập nhật danh mục (Admin)',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID',
            example: id,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCategoryInput' },
              example: {
                name: 'Tablet Updated',
                description: 'Máy tính bảng đã cập nhật',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cập nhật thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
          400: { description: 'Cập nhật thất bại' },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền admin' },
          404: { description: 'Không tìm thấy danh mục' },
          409: { description: 'Tên danh mục đã tồn tại' },
        },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Xóa danh mục (Admin) - Soft delete',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Category ID',
            example: id,
          },
        ],
        responses: {
          200: {
            description: 'Xóa thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Xóa danh mục thành công' },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền admin' },
          404: { description: 'Không tìm thấy danh mục' },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // PRODUCTS
    // ═══════════════════════════════════════════════════════════
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Lấy danh sách sản phẩm (phân trang, lọc, tìm kiếm)',
        description: 'Hỗ trợ tìm kiếm theo tên, lọc theo danh mục, khoảng giá, và sắp xếp.',
        security: [],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Số trang',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 10 },
            description: 'Số sản phẩm mỗi trang',
          },
          {
            in: 'query',
            name: 'category',
            schema: { type: 'string' },
            description: 'Lọc theo category ID',
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Tìm kiếm theo tên/mô tả',
          },
          {
            in: 'query',
            name: 'minPrice',
            schema: { type: 'number' },
            description: 'Giá tối thiểu',
          },
          {
            in: 'query',
            name: 'maxPrice',
            schema: { type: 'number' },
            description: 'Giá tối đa',
          },
          {
            in: 'query',
            name: 'sort',
            schema: { type: 'string' },
            description: 'Sắp xếp: name, -name, price, -price, createdAt, -createdAt, rating, -rating',
          },
        ],
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductListResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Tạo sản phẩm mới (Admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProductInput' },
              example: {
                name: 'iPhone 16',
                description: 'iPhone 16 mới nhất, chip A18, camera 48MP',
                price: 25990000,
                stock: 100,
                category: id,
                sku: 'IP16-256',
                images: [{ url: 'https://placehold.co/600x400?text=iPhone+16' }],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Tạo sản phẩm thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Tạo thất bại',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền admin' },
          409: { description: 'Tên hoặc SKU đã tồn tại' },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Lấy chi tiết sản phẩm theo ID',
        security: [],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
            example: id,
          },
        ],
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
          400: { description: 'ID không hợp lệ' },
          404: { description: 'Không tìm thấy sản phẩm' },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Cập nhật sản phẩm (Admin)',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
            example: id,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProductInput' },
              example: {
                name: 'iPhone 16 Pro Max',
                price: 34990000,
                stock: 80,
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cập nhật thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
          400: { description: 'Cập nhật thất bại' },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền admin' },
          404: { description: 'Không tìm thấy sản phẩm' },
          409: { description: 'Tên hoặc SKU đã tồn tại' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Xóa sản phẩm (Admin) - Soft delete',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
            example: id,
          },
        ],
        responses: {
          200: {
            description: 'Xóa thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Xóa sản phẩm thành công' },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền admin' },
          404: { description: 'Không tìm thấy sản phẩm' },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // REVIEWS
    // ═══════════════════════════════════════════════════════════
    '/api/products/{id}/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Tạo đánh giá cho sản phẩm',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
            example: id,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateReviewInput' },
              example: {
                rating: 5,
                comment: 'Sản phẩm rất tuyệt vời, đáng đồng tiền!',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Tạo đánh giá thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Review' },
                  },
                },
              },
            },
          },
          400: { description: 'Tạo thất bại hoặc sản phẩm không tồn tại' },
          401: { description: 'Chưa đăng nhập' },
          404: { description: 'Không tìm thấy sản phẩm' },
          409: { description: 'Bạn đã đánh giá sản phẩm này rồi' },
        },
      },
      get: {
        tags: ['Reviews'],
        summary: 'Lấy danh sách đánh giá của sản phẩm',
        security: [],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
            example: id,
          },
        ],
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Review' },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'ID không hợp lệ' },
          404: { description: 'Không tìm thấy sản phẩm' },
        },
      },
    },
    '/api/products/{id}/reviews/{reviewId}': {
      put: {
        tags: ['Reviews'],
        summary: 'Cập nhật đánh giá (chủ sở hữu hoặc Admin)',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
            example: id,
          },
          {
            in: 'path',
            name: 'reviewId',
            required: true,
            schema: { type: 'string' },
            description: 'Review ID',
            example: id,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateReviewInput' },
              example: {
                rating: 4,
                comment: 'Đã cập nhật: chất lượng ổn!',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cập nhật thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Review' },
                  },
                },
              },
            },
          },
          400: { description: 'Cập nhật thất bại' },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền cập nhật' },
          404: { description: 'Không tìm thấy đánh giá' },
        },
      },
      delete: {
        tags: ['Reviews'],
        summary: 'Xóa đánh giá (chủ sở hữu hoặc Admin)',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID',
            example: id,
          },
          {
            in: 'path',
            name: 'reviewId',
            required: true,
            schema: { type: 'string' },
            description: 'Review ID',
            example: id,
          },
        ],
        responses: {
          200: {
            description: 'Xóa thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Xóa đánh giá thành công!' },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền xóa' },
          404: { description: 'Không tìm thấy đánh giá' },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // CART
    // ═══════════════════════════════════════════════════════════
    '/api/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Lấy giỏ hàng của người dùng hiện tại',
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Cart' },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          404: { description: 'Không tìm thấy giỏ hàng' },
        },
      },
    },
    '/api/cart/add': {
      post: {
        tags: ['Cart'],
        summary: 'Thêm sản phẩm vào giỏ hàng',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddToCartInput' },
              example: {
                productId: id,
                quantity: 2,
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Thêm thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Cart' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Thêm thất bại (hết hàng, v.v.)',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          404: { description: 'Không tìm thấy sản phẩm hoặc giỏ hàng' },
        },
      },
    },
    '/api/cart/update': {
      put: {
        tags: ['Cart'],
        summary: 'Cập nhật số lượng sản phẩm trong giỏ',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCartItemInput' },
              example: {
                productId: id,
                quantity: 5,
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cập nhật thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Cart' },
                  },
                },
              },
            },
          },
          400: { description: 'Cập nhật thất bại' },
          401: { description: 'Chưa đăng nhập' },
          404: { description: 'Không tìm thấy sản phẩm hoặc giỏ hàng' },
        },
      },
    },
    '/api/cart/remove/{productId}': {
      delete: {
        tags: ['Cart'],
        summary: 'Xóa sản phẩm khỏi giỏ hàng',
        parameters: [
          {
            in: 'path',
            name: 'productId',
            required: true,
            schema: { type: 'string' },
            description: 'Product ID cần xóa',
            example: id,
          },
        ],
        responses: {
          200: {
            description: 'Xóa thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Cart' },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          404: { description: 'Không tìm thấy sản phẩm trong giỏ' },
        },
      },
    },
    '/api/cart/clear': {
      delete: {
        tags: ['Cart'],
        summary: 'Xóa toàn bộ giỏ hàng',
        responses: {
          200: {
            description: 'Xóa thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Đã xóa toàn bộ giỏ hàng!' },
                    data: { $ref: '#/components/schemas/Cart' },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          404: { description: 'Không tìm thấy giỏ hàng' },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // ORDERS
    // ═══════════════════════════════════════════════════════════
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Tạo đơn hàng từ giỏ hàng',
        description: 'Tạo đơn hàng từ các sản phẩm trong giỏ hàng hiện tại. Giỏ hàng sẽ được清空 sau khi đặt hàng thành công.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderInput' },
              example: {
                shippingAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Tạo đơn hàng thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Tạo thất bại (giỏ trống, hết hàng, v.v.)',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          401: { description: 'Chưa đăng nhập' },
        },
      },
      get: {
        tags: ['Orders'],
        summary: 'Lấy danh sách đơn hàng của người dùng',
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Order' },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
        },
      },
    },
    '/api/orders/all': {
      get: {
        tags: ['Orders'],
        summary: 'Lấy tất cả đơn hàng (Admin)',
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Order' },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền admin' },
        },
      },
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Lấy chi tiết đơn hàng theo ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
            example: id,
          },
        ],
        responses: {
          200: {
            description: 'Thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
          400: { description: 'ID không hợp lệ' },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền xem đơn hàng này' },
          404: { description: 'Không tìm thấy đơn hàng' },
        },
      },
    },
    '/api/orders/{id}/status': {
      put: {
        tags: ['Orders'],
        summary: 'Cập nhật trạng thái đơn hàng (Admin)',
        description: 'Trạng thái: pending → processing → shipped → delivered. Có thể cancel nếu chưa shipped/delivered.',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Order ID',
            example: id,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateOrderStatusInput' },
              example: {
                status: 'processing',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cập nhật thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Cập nhật thất bại (trạng thái không hợp lệ)',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
          401: { description: 'Chưa đăng nhập' },
          403: { description: 'Không có quyền admin' },
          404: { description: 'Không tìm thấy đơn hàng' },
        },
      },
    },
  },
};

module.exports = specs;
