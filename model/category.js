import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    _id: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
});

const Category = mongoose.model('category',categorySchema);
export default Category;