const graphqlFields = require("graphql-fields");
const productService = require("../../services/productService");
const {
  createProductSchema,
  updateProductSchema,
} = require("../../utils/product.validation");

const checkAdmin = (context) => {
  if (!context.user || context.user.role !== "admin")
    throw new Error("Chỉ Admin mới có quyền thực hiện.");
};

const getSelectString = (fieldsObj) => {
  return Object.keys(fieldsObj)
    .filter(
      (key) =>
        (typeof fieldsObj[key] === "object" &&
          Object.keys(fieldsObj[key]).length === 0) ||
        key !== "__typename",
    )
    .join(" ");
};

module.exports = {
  Query: {
    products: async (_, args, context, info) => {
      const fieldsObj = graphqlFields(info);
      const selectString = fieldsObj.products
        ? getSelectString(fieldsObj.products)
        : "";
      return await productService.findAllProducts(
        args.pagination || {},
        selectString,
      );
    },
    product: async (_, args, context, info) => {
      const fieldsObj = graphqlFields(info);
      const selectString = getSelectString(fieldsObj);
      return await productService.findProductById(args.id, selectString);
    },
  },
  Mutation: {
    createProduct: async (_, args, context) => {
      checkAdmin(context);
      createProductSchema.parse({ body: args.input });
      return await productService.createProduct(args.input);
    },
    updateProduct: async (_, args, context) => {
      checkAdmin(context);
      updateProductSchema.parse({
        params: { id: args.id },
        body: args.input,
      });
      return await productService.updateProduct(args.id, args.input);
    },
    deleteProduct: async (_, args, context) => {
      checkAdmin(context);
      await productService.deleteProduct(args.id);
      return true;
    },
  },
};
