import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLError, GraphQLInt } = require('graphql');

import Product from '../../model/product.js';

export const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        price: {type: GraphQLInt},
    }
)});

const handleErrors = (err) => {
    let errors = {title: '', error: ''};

    if(err.code === 11000) {
        if(err.keyValue.title) {
            errors.title = 'product is already added';
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


export const getProduct = {
    name: 'getProduct',
    type: ProductType,
    args: {id: {type: GraphQLID}},
    resolve: async (parent, args) => {
      try {
        const product =  await Product.findById(args.id);
        if (!product) {
          throw new Error('product not found');
        }
      } catch (error) {
        return new GraphQLError(handleErrors(error));
      }
    }
};

export const addProduct = {
  name: 'addProduct',
  type: ProductType,
  args: {
    title: {type: GraphQLString},
    description: {type: GraphQLString},
    image: {type: GraphQLString},
    category: {type: GraphQLInt},
    price: {type: GraphQLInt},
    size: {type: GraphQLInt},
  },
  resolve: async (parent, args) => {
    try {
      const product = new Product({
        title: args.title,
        description: args.description,
        image: args.image,
        category: args.category,
        price: args.price,
        size: args.size,
      });
      return await product.save();
    } catch (error) {
      return new GraphQLError(handleErrors(error));
    }
  }
};

export const getAllProducts = {
  name: 'Products',
  type: new GraphQLList(ProductType),
  resolve: async () => {
    const products =  await Product.find({});
    console.log(products);
    return products;
  }
};

