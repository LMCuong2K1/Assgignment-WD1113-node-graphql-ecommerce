const orderService = require("../../services/orderService");
const { objectIdSchema } = require("../../utils/validators");
const {
  shippingAddressInputSchema,
  orderStatusInputSchema,
} = require("../../utils/order.validation");

const checkAuth = (context) => {
  if (!context.user)
    throw new Error("Bạn phải đăng nhập để thực hiện chức năng này!");
};

const checkAdmin = (context) => {
  if (!context.user || context.user.role !== "admin")
    throw new Error("Chỉ Admin mới có quyền thực hiện.");
};

module.exports = {
  Query: {
    myOrders: async (_, args, context) => {
      checkAuth(context);
      return await orderService.getOrders(context.user.id);
    },
    order: async (_, args, context) => {
      checkAuth(context);
      objectIdSchema.parse(args.id);
      return await orderService.getOrderById(
        args.id,
        context.user.id,
        context.user.role,
      );
    },
    allOrders: async (_, args, context) => {
      checkAdmin(context);
      return await orderService.getAllOrders();
    },
  },
  Mutation: {
    createOrder: async (_, args, context) => {
      checkAuth(context);
      shippingAddressInputSchema.parse({
        shippingAddress: args.shippingAddress,
      });
      return await orderService.createOrder(
        context.user.id,
        args.shippingAddress,
      );
    },
    updateOrderStatus: async (_, args, context) => {
      checkAdmin(context);
      objectIdSchema.parse(args.id);
      orderStatusInputSchema.parse({ status: args.status });
      return await orderService.updateOrderStatus(args.id, args.status);
    },
  },
};
