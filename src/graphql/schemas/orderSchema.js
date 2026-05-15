module.exports = {
  typeDefs: `#graphql
    type OrderItem {
        product: Product!
        quantity: Int!
        price: Float!
    }
        enum OrderStatus{
        pending
        processing
        shipped
        delivered
        }

    type Order {
        _id: ID!
        user: ID!
        items: [OrderItem!]
        totalPrice: Float!
        status: OrderStatus!
        shippingAddress: String!
        createdAt: String
        updatedAt: String
    }

    type Query {
        myOrders: [Order]
        order(id: ID!): Order
        allOrders: [Order]
    }

    type Mutation {
        createOrder(shippingAddress: String!): Order
        updateOrderStatus(id: ID!, status: OrderStatus!): Order
    }
    `,
};
