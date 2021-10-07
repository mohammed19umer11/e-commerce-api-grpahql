import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLSchema, GraphQLObjectType } = require('graphql');
import { userLogin, userSignUp, getUser } from './typeDef/User.js';
import { getProduct, getAllProducts } from './typeDef/Product.js';
import { addToCart } from './typeDef/Cart.js';
import { createOrder } from './typeDef/Order.js';


const Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    userLogin,
    getUser,
    getProduct,
    getAllProducts,
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
    fields: {
      userSignUp,
      addToCart,
      createOrder,
    }
});

const userSchema = new GraphQLSchema({
  query: Root,
  mutation: Mutation,
});

export default userSchema; 