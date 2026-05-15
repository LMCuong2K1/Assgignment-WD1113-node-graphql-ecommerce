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
};
