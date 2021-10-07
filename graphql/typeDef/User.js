import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLError } = require('graphql');

import User from '../../model/user.js';
import Cart from '../../model/cart.js';
import Order from '../../model/order.js';
import { CartType } from './Cart.js';
import { OrderType } from './Order.js';

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        username: {type: GraphQLString},
        email: {type: GraphQLString},
        cart: {
          type: CartType,
          resolve: async (user, args,{loader}) => {
            // return await Cart.findOne({_id: user.cartId});
            try {
              return loader.single.load(Cart,user.cartId)
            } catch (error) {
              console.log(error)
            }
          }
        },
        orders: {
          type: new GraphQLList(OrderType),
          resolve: async (user, args) => {
            try {
              return await Order.find({_id: {$in : user.orderIds}});
            } catch (error) {
              console.log(error)            }
          }
        }
    }
)});

const handleErrors = (err) => {
    let errors = {username: '', email: '', password: '', error: ''};

    if(err.code === 11000) {
        if(err.keyValue.username) {
            errors.username = 'username is taken';
        }
        if(err.keyValue.email) {
          errors.email = 'that email is already registered';
      }
        return errors;
    }

    else if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    else { errors.error = err.message; }
    return errors;
};

export const userLogin = {
    name: 'userLogin',
    type: UserType,
    args: {email: {type: GraphQLString}, password: {type: GraphQLString}},
    resolve: async (_, args) => {
      try {
        const user =  await User.findOne({email: args.email});
        return user;
      } catch (error) {
        return new GraphQLError(handleErrors(error));
      }
    }
};

export const getUser  = {
    name: 'getUser',
    type: UserType,
    args: {id: {type: GraphQLID}},
    resolve: async (user, args, context) => {
      try {
        const user =  await User.findById(args.id);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        return new GraphQLError(handleErrors(error));
      }
    }
};

export const userSignUp = {
  name: 'userSignUp',
  type: UserType,
  args: {
    username: {type: GraphQLString},
    email: {type: GraphQLString},
    password: {type: GraphQLString},
  },
  resolve: async (_, args) => {
    try {
      const user = new User({
        username: args.username,
        email: args.email,
        password: args.password
      });
      return await user.save();
    } catch (error) {
      return new GraphQLError(handleErrors(error));
    }
  }
};

export const getAllUsers = {
  name: 'users',
  type: new GraphQLList(UserType),
  resolve: async () => {
    const users =  await User.find({});
    return users;
  }
};

