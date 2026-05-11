// 1. IMPORT Model để dùng trong resolvers
const Category = require("../../models/Category");

// 2. KHAI BÁO SCHEMA (Bản đồ dữ liệu)
module.exports = {
  typeDefs: `#graphql
  # Mô tả cấu trúc dữ liệu của một Category
  type Category {
    _id: ID!
    name: String!
    description: String
    slug: String!
    isActive: Boolean
  }

  # BẮT BUỘC: Khai báo các hành động GET (Lấy dữ liệu)
  type Query {
    # Hàm này trả về một mảng ([]) các Category
    categories: [Category]
  }

  # BẮT BUỘC: Khai báo các hành động POST/PUT/DELETE
  type Mutation {
    # Hàm này nhận tham số name, description và trả về Category vừa tạo
    createCategory(name: String!, description: String): Category
  }
`,

  // 3. THỰC THI LOGIC (Giống như Controller)
  resolvers: {
    Query: {
      categories: async () => {
        return await Category.find({ isActive: true });
      },
    },
    Mutation: {
      createCategory: async (_, args) => {
        return await Category.create({
          name: args.name,
          description: args.description,
        });
      },
    },
  }
}

