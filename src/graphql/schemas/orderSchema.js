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
        cancelled
        }

    type Order {
        _id: ID!
        user: User!
        items: [OrderItem!]
        totalPrice: Float!
        status: OrderStatus!
        shippingAddress: String!
        createdAt: String
        updatedAt: String
    }

    type Query {
        orders: [Order]
        order(id: ID!): Order
        allOrders: [Order]
    }

    type Mutation {
        createOrder(shippingAddress: String!): Order
        updateOrderStatus(id: ID!, status: OrderStatus!): Order
    }
    `,
};
