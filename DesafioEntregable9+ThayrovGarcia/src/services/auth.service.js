import {createHash, isValidPassword} from '../config/bcrypt.js';

import {DAOFactory} from '../dao/factory.js';
import fetch from 'node-fetch';

class AuthService {
	constructor() {
		this.userDAO = DAOFactory('user');
	}

	async loginUser(username, password) {
		const user = await this.userDAO.findOne({email: username});
		if (!user || !isValidPassword(password, user.password)) {
			throw new Error('Invalid credentials');
		}
		return user;
	}

	async registerUser(user) {
		const existingUser = await this.userDAO.findOne({email: user.email});
		if (existingUser) {
			throw new Error('User already exists');
		}
		const hashedPassword = await createHash(user.password);
		user.password = hashedPassword;
		return await this.userDAO.create(user);
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

		let user = await this.userDAO.findOne({email: profile.email});
		if (!user) {
			const newUser = {
				email: profile.email,
				first_name: profile._json.name || profile._json.login || 'noname',
				last_name: 'nolast',
				age: 0,
				role: 'user',
				password: createHash(accessToken.substring(0, 10)),
			};
			user = await this.userDAO.create(newUser);
			console.log('User Registration successful');
		} else {
			console.log('User already exists');
		}
		return user;
	}
}

export default new AuthService();
