import UserModel from '../dao/models/user.model.js';
import {isValidPassword} from '../../utils.js';

class AuthService {
	async registerUser(user) {
		const existingUser = await UserModel.findOne({email: user.email});
		if (existingUser) {
			throw new Error('User already exists');
		}
		const newUser = new UserModel(user);
		return await newUser.save();
	}

	async loginUser({email, password}) {
		const user = await UserModel.findOne({email});
		if (!user || !isValidPassword(password, user.password)) {
			throw new Error('Invalid credentials');
		}
		return user;
	}
}

export default new AuthService();
