module.exports = {
  typeDefs: `#graphql

  type CartItem{
  product:Product!
  quantity:Int!
  }
type Cart{
_id:ID!
user:ID!
items:[CartItem]
createdAt:String
updatedAt:String
}

input addCartInput{
productId:ID!
quantity:Int!
}

input updateCartInput{
productId:ID!
quantity:Int!
}

input removeCartInput{
productId:ID!
}


type Query{
    cart:Cart
}

type Mutation{
    addToCart(input:addCartInput):Cart
    updateCartItem(input:updateCartInput):Cart
    removeFromCart(input:removeCartInput):Cart
    clearCart:Cart
}
`,
};
