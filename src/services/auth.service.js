import {
	accountDeletionNoticeMailOptions,
	passwordResetMailOptions,
	transporter,
} from '../config/nodemailer.config.js';
import {createHash, isValidPassword} from '../config/bcrypt.config.js';

import {DAOFactory} from '../dao/factory.js';
import crypto from 'crypto';
import fetch from 'node-fetch';
import {logger} from '../config/logger.config.js';

class AuthService {
	async init() {
		this.userDAO = await DAOFactory('user');
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
			logger.error('Cannot get a valid email for this user');
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
			logger.info('User Registration successful');
		} else {
			logger.info('User already exists');
		}
		return user;
	}
	async findUserById(id) {
		return await this.userDAO.findById(id);
	}

	async generateResetToken(email) {
		const user = await this.userDAO.findOne({email});
		if (!user) {
			throw new Error('User not found');
		}

		const token = crypto.randomBytes(20).toString('hex');
		const expires = new Date(Date.now() + 3600000); // 1 hour from now

		user.resetPasswordToken = token;
		user.resetPasswordExpires = expires;

		await this.userDAO.update({_id: user._id}, user);

		return token;
	}

	async requestPasswordReset(email) {
		const token = await this.generateResetToken(email);
		const mailOptions = passwordResetMailOptions(email, token);
		await transporter.sendMail(mailOptions);
	}

	async validateResetToken(email, token) {
		const user = await this.userDAO.findOne({
			email,
			resetPasswordToken: token,
			resetPasswordExpires: {$gt: Date.now()},
		});

		if (!user) {
			throw new Error('Invalid or expired reset token');
		}

		return true;
	}

	async updatePassword(email, newPassword) {
		const user = await this.userDAO.findOne({email});
		if (!user) {
			throw new Error('User not found');
		}

		if (isValidPassword(newPassword, user.password)) {
			throw new Error(
				'New password cannot be the same as the current password',
			);
		}

		const hashedPassword = createHash(newPassword);
		await this.userDAO.update(
			{email},
			{
				password: hashedPassword,
				resetPasswordToken: undefined,
				resetPasswordExpires: undefined,
			},
		);
	}
	async toggleUserRole(userId) {
		const user = await this.userDAO.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		const requiredDocs = [
			'Identificacion',
			'ComprobanteDeDomicilio',
			'ComprobanteDeEstadoDeCuenta',
		];

		const uploadedDocs = user.documents.map(doc =>
			doc.name.split('.').slice(0, -1).join('.'),
		);

		const allDocsUploaded = requiredDocs.every(doc =>
			uploadedDocs.includes(doc),
		);
		if (!allDocsUploaded) {
			throw new Error('Incomplete documentation');
		}

		user.role = user.role === 'premium' ? 'user' : 'premium';
		await this.userDAO.update({_id: userId}, {role: user.role});

		return user;
	}

	async addDocumentsToUser(userId, documents) {
		return await this.userDAO.addDocuments(userId, documents);
	}

	async updateLastUserConnection(userId, lastConnection) {
		return await this.userDAO.updateLastConnection(userId, lastConnection);
	}

	async getAllUsers() {
		const users = await this.userDAO.findAll();
		const simplifiedUsers = users.map(user => ({
			name: `${user.first_name} ${user.last_name}`,
			email: user.email,
			role: user.role,
		}));
		return simplifiedUsers;
	}

	async removeInactiveUsersAndNotify() {
		const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
		const deletedUsers = await this.userDAO.removeInactiveUsers(twoDaysAgo);

		// Check if any user was deleted
		if (deletedUsers.deletedCount === 0) {
			return {message: 'No users to delete'};
		}

		// Loop through deleted users and send an email to each
		for (const user of deletedUsers) {
			const mailOptions = accountDeletionNoticeMailOptions(user);
			await transporter.sendMail(mailOptions);
		}

		return {message: 'Users deleted', deletedUsers};
	}
}

let authService;

export const initializeAuthService = async () => {
	if (!authService) {
		authService = new AuthService();
		await authService.init();
	}
	return authService;
};
