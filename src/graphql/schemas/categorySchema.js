const categoryService = require("../../services/categoryService");
const graphqlFields = require("graphql-fields");
const { objectIdSchema } = require("../../utils/validators");

const checkAdmin = (context) => {
  if (!context.user || context.user.role !== "admin")
    throw new Error("Bạn không có quyền thực hiện chức năng này!");
};

module.exports = {
  typeDefs: `#graphql
  type Category {
    _id: ID!
    name: String!
    description: String
    parent: Category
    children: [Category]
    slug: String!
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }
  input createCategoryInput {
    name: String!
    description: String
    parent: ID
  }

  input updateCategoryInput {
    name: String
    description: String
    parent: ID
    isActive: Boolean
  }

  type Query {
    categories: [Category]
    category(id: ID!): Category
  }

  type Mutation {
    createCategory(input:createCategoryInput): Category
    updateCategory(id: ID!, input:updateCategoryInput): Category
    deleteCategory(id: ID!): Boolean
  }
`,

  resolvers: {
    Query: {
      categories: async (_, args, context, info) => {
        const fieldsObj = graphqlFields(info);
        const selectString = Object.keys(fieldsObj).join(" ");
        return await categoryService.getCategories(selectString);
      },
      category: async (_, args, context, info) => {
        objectIdSchema.parse(args.id);
        const fieldsObj = graphqlFields(info);
        const selectString = Object.keys(fieldsObj).join(" ");
        return await categoryService.getCategoryById(args.id, selectString);
      },
    },
    Mutation: {
      createCategory: async (_, args, context) => {
        checkAdmin(context);
        return await categoryService.createCategory(args.input);
      },
      updateCategory: async (_, args, context) => {
        checkAdmin(context);
        objectIdSchema.parse(args.id);
        return await categoryService.updateCategory(args.id, args.input);
      },
      deleteCategory: async (_, args, context) => {
        checkAdmin(context);
        objectIdSchema.parse(args.id);
        await categoryService.deleteCategory(args.id);
        return true;
      },
    },
  },
};
