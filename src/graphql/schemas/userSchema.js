const authService = require("../../services/authService");
const {
  registerSchema,
  loginSchema,
  updateUserProfileSchema,
  updateUserByAdminSchema,
} = require("../../utils/user.validation");
const { objectIdSchema } = require("../../utils/validators");

const checkUser = (context) => {
  if (!context.user) throw new Error("Bạn chưa đăng nhập!");
  return context.user;
};
const checkAdmin = (context) => {
  if (!context.user || context.user.role !== "admin")
    throw new Error("Bạn không có quyền thực hiện chức năng này!");
  return context.user;
};

module.exports = {
  typeDefs: `#graphql
    enum Role{user,admin}
    
    type User {
    _id:ID!
    name:String!
    email:String!
    role:Role!
    phone:String
    address:String
    }
    type AuthPayload { user: User!, token: String! }
    input RegisterInput {
        name:String!
        email:String!
        password:String!
    }
    input LoginInput {
        email:String!
        password:String!
}
    input UpdateProfileInput { 
        name:String
        phone:String
        address:String
    }
    input UpdateUserByAdminInput {
        role:Role
        name:String
        email:String
        password:String
        phone:String
        address:String
    }

    type Query {
      me: User
      users: [User]
    }
    type Mutation {
      register(input: RegisterInput!): AuthPayload
      login(input: LoginInput!): AuthPayload
      updateProfile(input: UpdateProfileInput!): User
      updateUserByAdmin(id: ID!, input: UpdateUserByAdminInput!): User
    }
  `,
  resolvers: {
    Query: {
      me: async (_, __, context) => {
        const user = checkUser(context);
        return await authService.getProfile(user._id);
      },
      users: async (_, __, context) => {
        checkAdmin(context);
        return await authService.getAllUsers();
      },
    },
    Mutation: {
      register: async (_, args) => {
        registerSchema.parse({ body: args.input });
        return await authService.register(args.input);
      },
      login: async (_, args) => {
        loginSchema.parse({ body: args.input });
        return await authService.login(args.input);
      },
      updateProfile: async (_, args, context) => {
        checkUser(context);
        updateUserProfileSchema.parse({ body: args.input });
        return await authService.updateProfile(context.user._id, args.input);
      },
      updateUserByAdmin: async (_, args, context) => {
        checkAdmin(context);
        objectIdSchema.parse(args.id);
        updateUserByAdminSchema.parse({ body: args.input });
        return await authService.updateUserByAdmin(args.id, args.input);
      },
    },
  },
};
