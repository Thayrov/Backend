import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	email: {type: String, required: true},
	age: {type: Number, required: true},
	password: {type: String, required: true},
	role: {type: String, default: 'user'},
});

const UserModel = model('User', UserSchema);

export default UserModel;