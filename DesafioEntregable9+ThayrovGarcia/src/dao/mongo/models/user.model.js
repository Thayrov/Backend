import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
	email: {type: String, required: true, unique: true, max: 100},
	password: {type: String, required: false, max: 100},
	first_name: {type: String, required: false, max: 100},
	last_name: {type: String, required: false, max: 100},
	age: {type: Number, required: false, max: 100},
	cart: {
		type: Schema.Types.ObjectId,
		ref: 'carts',
		required: false,
		max: 100,
	},
	role: {type: String, default: 'user', required: true},
});

UserSchema.pre(['find', 'findOne', 'findById'], function () {
	this.populate('cart');
});

const UserModel = model('User', UserSchema);

export default UserModel;
