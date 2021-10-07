import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    username : { type: String, required: [true, 'please enter a username'], unique: true, lowercase: true },
    email : { type: String, required: [true, 'please enter an email'], unique: true },
    password : { type: String, required: true, minLength : [8, 'password should contain atleast 8 characters'] },
    cartId : { type: mongoose.Schema.Types.ObjectId, ref: 'cart' },
    orderIds : [ {type: mongoose.Schema.Types.ObjectId, ref: 'order'} ],
    isAdmin : { type: Boolean, default: false },
    },
    {timestamps: true}
);

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('user',userSchema);
export default User;