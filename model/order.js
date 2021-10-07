import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'user', required:[true, 'userId required']},
    cartId : {type: mongoose.Schema.Types.ObjectId, ref: 'cart', required:[true, 'cartId required']},
    totalPrice :{type: Number, required: [true, 'total price required']},
    address :{type: String, required: [true, 'address required']},
},{timestamps: true});

const Order = mongoose.model('order',orderSchema);
export default Order;