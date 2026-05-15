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
`,
};