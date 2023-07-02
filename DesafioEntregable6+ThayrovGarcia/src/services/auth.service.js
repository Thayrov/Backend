import UserModel from '../dao/models/user.model.js';

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
		if (!user) {
			throw new Error('Invalid credentials');
		}
		if (user.password !== password) {
			throw new Error('Invalid credentials');
		}
		return user;
	}
}

export default new AuthService();
