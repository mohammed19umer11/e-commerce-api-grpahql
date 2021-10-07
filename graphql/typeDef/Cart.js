import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLError, GraphQLInt } = require('graphql');

import Cart from '../../model/cart.js';
import Product from '../../model/product.js';
import User from '../../model/user.js';
import { ProductType } from './Product.js';
import { UserType } from './User.js';

export const CartType = new GraphQLObjectType({
    name: 'Cart',
    fields: () => ({
        id: {type: GraphQLID},
        user: {
          type: UserType,
          resolve: async (cart, args) => {
            return await User.findById(cart.userId);
          }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve: async (cart, args) => {
              try {
                return await Product.find({_id: {$in: cart.productIds}});
              }catch(error) {
                console.log(error)              }
            }
        },
    }
)});

const handleErrors = (err) => {
    let errors = {title: '', error: ''};

    if(err.code === 11000) {
        if(err.keyValue.title) {
            errors.username = 'username is taken';
        }
        return errors;
    }

    else if (err.message.includes("product validation failed")) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    else { errors.error = err.message; }
    return errors;
};

export const addToCart = {
  name: 'addToCart',
  type: CartType,
  args: {
    userId: {type: GraphQLID},
    productIds: {type: new GraphQLList(GraphQLID)},
    price: {type: GraphQLInt},
  },
  resolve: async (_, args) => {
    try {
      const cart = new Cart({
        userId: args.userId,
        productIds: args.productIds,
      });
      await User.findByIdAndUpdate({_id : cart.userId},{cartId: cart._id});
      return await cart.save();
    } catch (error) {
      return new GraphQLError(handleErrors(error));
    }
  }
};

