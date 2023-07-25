import {createHash, isValidPassword} from '../config/bcrypt.js';

import UserModel from '../dao/models/user.model.js';
import fetch from 'node-fetch';

class AuthService {
	async loginUser(username, password) {
		const user = await UserModel.findOne({email: username});
		if (!user || !isValidPassword(password, user.password)) {
			throw new Error('Invalid credentials');
		}
		return user;
	}

	async registerUser(user) {
		const existingUser = await UserModel.findOne({email: user.email});
		if (existingUser) {
			throw new Error('User already exists');
		}
		const hashedPassword = await createHash(user.password);
		user.password = hashedPassword;
		const newUser = new UserModel(user);
		return await newUser.save();
	}

	async githubAuth(accessToken, profile) {
		const res = await fetch('https://api.github.com/user/emails', {
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: 'Bearer ' + accessToken,
				'X-Github-Api-Version': '2022-11-28',
			},
		});
		const emails = await res.json();
		const emailDetail = emails.find(email => email.verified == true);

		if (!emailDetail) {
			throw new Error('Cannot get a valid email for this user');
		}
		profile.email = emailDetail.email;

		let user = await UserModel.findOne({email: profile.email});
		if (!user) {
			const newUser = {
				email: profile.email,
				first_name: profile._json.name || profile._json.login || 'noname',
				last_name: 'nolast',
				age: 0,
				role: 'user',
				password: createHash(accessToken.substring(0, 10)),
			};
			user = await UserModel.create(newUser);
			console.log('User Registration successful');
		} else {
			console.log('User already exists');
		}
		return user;
	}
}

export default new AuthService();
