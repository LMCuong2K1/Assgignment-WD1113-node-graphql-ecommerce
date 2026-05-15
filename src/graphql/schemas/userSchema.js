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
};
