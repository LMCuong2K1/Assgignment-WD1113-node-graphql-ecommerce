const graphqlFields = require("graphql-fields");
const cartService = require("../../services/cartService");
const { cartItemInputSchema } = require("../../utils/cart.validation");
const { objectIdSchema } = require("../../utils/validators");

const cartFieldSelect = (info) => {
  const fieldsObj = graphqlFields(info);
  const cartFields = Object.keys(fieldsObj).join(" ");
  let productFields = "";
  if (fieldsObj.items && fieldsObj.items.product) {
    productFields = Object.keys(fieldsObj.items.product).join(" ");
  }
  return { cartFields, productFields };
};

const userCheck = (context) => {
  if (!context.user)
    throw new Error("Bạn phải đăng nhập để sử dụng chức năng này!");
};

module.exports = {
  Query: {
    getCart: async (_, args, context, info) => {
      userCheck(context);
      const { cartFields, productFields } = cartFieldSelect(info);
      return await cartService.getCart(
        context.user.id,
        cartFields,
        productFields,
      );
    },
  },
  Mutation: {
    addToCart: async (_, args, context, info) => {
      userCheck(context);
      cartItemInputSchema.parse({
        productId: args.input.productId,
        quantity: args.input.quantity,
      });
      const { cartFields, productFields } = cartFieldSelect(info);
      return await cartService.addToCart(
        context.user.id,
        args.input.productId,
        args.input.quantity,
        cartFields,
        productFields,
      );
    },
    updateCartItem: async (_, args, context, info) => {
      userCheck(context);
      cartItemInputSchema.parse({
        productId: args.input.productId,
        quantity: args.input.quantity,
      });
      const { cartFields, productFields } = cartFieldSelect(info);
      return await cartService.updateCartItem(
        context.user.id,
        args.input.productId,
        args.input.quantity,
        cartFields,
        productFields,
      );
    },
    removeFromCart: async (_, args, context, info) => {
      userCheck(context);
      objectIdSchema.parse(args.input.productId);
      const { cartFields, productFields } = cartFieldSelect(info);
      return await cartService.removeFromCart(
        context.user.id,
        args.input.productId,
        cartFields,
        productFields,
      );
    },
    clearCart: async (_, args, context, info) => {
      userCheck(context);
      return await cartService.clearCart(context.user.id);
    },
  },
};
