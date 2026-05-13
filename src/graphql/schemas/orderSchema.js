const orderService = require("../../services/orderService");

const checkAuth = (context) => {
    if (!context.user) throw new Error("Bạn phải đăng nhập để thực hiện chức năng này!");
};

const checkAdmin = (context) => {
    if (!context.user || context.user.role !== 'admin') throw new Error("Unauthorized! Chỉ Admin mới có quyền thực hiện.");
};

module.exports = {
    typeDefs: `#graphql
    type OrderItem {
        product: Product!
        quantity: Int!
        price: Float!
    }

    type Order {
        _id: ID!
        user: ID!
        items: [OrderItem!]
        totalPrice: Float!
        status: String!
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
        updateOrderStatus(id: ID!, status: String!): Order
    }
    `,
    resolvers: {
        Query: {
            myOrders: async (_, args, context) => {
                checkAuth(context);
                return await orderService.getOrders(context.user.id);
            },
            order: async (_, args, context) => {
                checkAuth(context);
                return await orderService.getOrderById(args.id, context.user.id, context.user.role);
            },
            allOrders: async (_, args, context) => {
                checkAdmin(context);
                return await orderService.getAllOrders();
            },
        },
        Mutation: {
            createOrder: async (_, args, context) => {
                checkAuth(context);
                return await orderService.createOrder(context.user.id, args.shippingAddress);
            },
            updateOrderStatus: async (_, args, context) => {
                checkAdmin(context);
                return await orderService.updateOrderStatus(args.id, args.status);
            }
        }
    }
}