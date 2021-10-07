import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    title: { type: String, required: [true, 'product name required'], unique: true },
    description: { type: String },
    image: { type: String },
    category: { type: Number, ref: 'category' },
    price: { type: Number },
    size: { type: Number, ref: 'size' },
},{timestamps: true});

const Product = mongoose.model('product',productSchema);
export default Product;