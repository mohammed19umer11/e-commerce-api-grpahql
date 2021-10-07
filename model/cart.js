import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    productIds :[{type: mongoose.Schema.Types.ObjectId, ref: 'product'}],
},{timestamps: true});

const Cart = mongoose.model('cart',cartSchema);
export default Cart;