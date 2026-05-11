const graphqlFields = require("graphql-fields");
const Product = require("../../models/Product");
const productService = require("../../services/productService");
const graphFields = require("graphql-fields");
module.exports = {
    typeDefs: `#graphql
    type ProductImage{
    url:String!
    public_id:String
    }
    type Product{
    _id:ID!
    name:String!
    description:String
    price:Float!
    stock:Int!
    category:Category!
    images:[ProductImage]
    isActive:Boolean
    slug:String!
    sku:String!
    numReviews:Int
    rating:Float
    createdAt:String
    updatedAt:String
    }
    input ProductImageInput{
    url:String!
    public_id:String
    }

    input ProductInput{
    name:String!
    description:String
    price:Float!
    stock:Int!
    images:[ProductImageInput]
    category:ID!
    sku:String!
    isActive:Boolean
    }

    input ProductUpdateInput{
    name:String
    description:String
    price:Float
    stock:Int
    category:ID
    images:[ProductImageInput]
    sku:String
    isActive:Boolean
    }
    input PaginationInput{
    page:Int
    limit:Int
    sort:String
    search:String
    category:String
    minPrice:Float
    maxPrice:Float
    }

    type ProductResponse{
    products:[Product]
    count:Int!
    }

    type Query{
    products(pagination:PaginationInput):ProductResponse
    product(id:ID!):Product
    }

    type Mutation{
        createProduct(input:ProductInput!):Product
        updateProduct(id:ID!,input:ProductUpdateInput!):Product
        deleteProduct(id:ID!):Boolean
    }

    }`,
    resolvers: {
        Query: {
            products: async (_, args, context, info) => {
                //lấy trường đã chọn
                const fieldsObj = graphqlFields(info);
                //nối chuỗi các trường bên trên
                const selectString = Object.keys(fieldsObj.products).join(" ");
                return await productService.findAllProducts(args.pagination || {}, selectString);
            },
            product: async (_, args, context, info) => {
                const fieldsObj = graphqlFields(info);
                const selectString = Object.keys(fieldsObj).join(" ");
                return await productService.findProductById(args.id, selectString);
            }
        },
        Mutation: {

            createProduct: async (_, args) => {
                return await productService.createProduct(args.input);
            },
            updateProduct: async (_, args) => {
                return await productService.updateProduct(args.id, args.input);
            },
            deleteProduct: async (_, args) => {
                await productService.deleteProduct(args.id);
                return true;
            }
        }
    }



}