import {Schema, model} from 'mongoose';

import {createHash} from '../utils.js';

const UserSchema = new Schema({
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	email: {type: String, required: true},
	age: {type: Number, required: true},
	password: {type: String, required: true},
	role: {type: String, default: 'user'},
});

UserSchema.pre('save', function (next) {
	this.password = createHash(this.password);
	next();
});

const UserModel = model('User', UserSchema);

export default UserModel;
