import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLError, GraphQLInt } = require('graphql');

import Cart from '../../model/cart.js';
import User from '../../model/user.js';
import Order from '../../model/order.js';
import { UserType } from './User.js';
import { CartType } from './Cart.js';

export const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: {type: GraphQLID},
        user: {
            type: UserType,
            resolve: async (order, args) => {
              return await User.findById(order.userId);
            }
        },
        cart: {
            type: CartType,
            resolve: async (order, args) => {
                return await Cart.findById(order.cartId);
            }
        },
        totalPrice: {type: GraphQLInt},
        address: {type: GraphQLString},
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

export const createOrder = {
  name: 'createOrder',
  type: OrderType,
  args: {
    userId: {type: GraphQLID},
    cartId: {type: GraphQLID},
    totalPrice: {type: GraphQLInt},
    address: {type: GraphQLString},
  },
  resolve: async (_, args) => {
    try {
      const order = new Order({
        userId: args.userId,
        cartId: args.cartId,
        totalPrice: args.totalPrice,
        address: args.address,
      });
      await User.findByIdAndUpdate({_id : order.userId},{ $push: { orderIds: order._id } });
      return await order.save();
    } catch (error) {
      return new GraphQLError(handleErrors(error));
    }
  }
};

