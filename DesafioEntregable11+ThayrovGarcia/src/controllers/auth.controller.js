import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';
import {UserResponseDTO} from '../dto/user.dto.js';
import environment from '../config/enviroment.config.js';
import {initializeAuthService} from '../services/auth.service.js';
import {logger} from '../config/logger.config.js';
import nodemailer from 'nodemailer';
import passport from 'passport';

const {GOOGLE_EMAIL, GOOGLE_PASS, PORT} = environment;

class AuthController {
	init = async () => {
		this.authService = await initializeAuthService();
	};
	registerUser = async (req, res, next) => {
		passport.authenticate('register', (err, user, info) => {
			if (err) {
				return next(
					CustomError.createError({
						name: 'RegistrationError',
						cause: err,
						message: 'Error during registration',
						code: EErrors.USER_VALIDATION_ERROR,
					}),
				);
			}
			if (!user) {
				logger.warn('No user returned from registration');
				return res.redirect('/register');
			}
			req.logIn(user, function (err) {
				if (err) {
					return next(
						CustomError.createError({
							name: 'LoginError',
							cause: err,
							message: 'Error logging in user after registration',
							code: EErrors.AUTHENTICATION_ERROR,
						}),
					);
				}
				logger.debug('User registered and logged in successfully:', user);
				return res.redirect('/profile');
			});
		})(req, res, next);
	};

	loginUser = async (req, res, next) => {
		passport.authenticate('login', (err, user, info) => {
			try {
				if (err) {
					return next(
						CustomError.createError({
							name: 'AuthenticationError',
							cause: err,
							message: 'Error during authentication',
							code: EErrors.AUTHENTICATION_ERROR,
						}),
					);
				}
				if (!user) {
					logger.warn('No user returned from authentication');
					return res.status(401).json({message: 'Invalid credentials'});
				}
				req.logIn(user, function (err) {
					if (err) {
						return next(
							CustomError.createError({
								name: 'LoginError',
								cause: err,
								message: 'Error logging in user',
								code: EErrors.AUTHENTICATION_ERROR,
							}),
						);
					}
					logger.info('User logged in successfully:', user);
					return res.redirect('/profile');
				});
			} catch (err) {
				return res.status(500).json({message: err.message});
			}
		})(req, res, next);
	};

	renderLoginForm = async (req, res, next) => {
		try {
			if (req.session.user) {
				return res.redirect('/profile');
			}
			return res.render('login');
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'RenderLoginError',
					cause: err,
					message: 'Error rendering login form',
					code: EErrors.UNAUTHORIZED_ACTION,
				}),
			);
		}
	};

	renderRegisterForm = async (req, res, next) => {
		try {
			if (req.session.user) {
				return res.redirect('/profile');
			}
			return res.render('register');
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'RenderRegisterError',
					cause: err,
					message: 'Error rendering register form',
					code: EErrors.UNAUTHORIZED_ACTION,
				}),
			);
		}
	};

	renderProfile = async (req, res, next) => {
		try {
			let user = req.user;
			if (user.toObject) {
				user = user.toObject();
			}
			delete user.password;
			logger.debug("profile's user: ", user);
			return res.render('profile', {user});
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'RenderProfileError',
					cause: err,
					message: 'Error rendering profile',
					code: EErrors.USER_NOT_FOUND,
				}),
			);
		}
	};

	renderAdmin = async (req, res, next) => {
		try {
			const {user} = req.session;
			return res.render('admin', {user});
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'RenderAdminError',
					cause: err,
					message: 'Error rendering admin page',
					code: EErrors.AUTHORIZATION_ERROR,
				}),
			);
		}
	};

	handleLogout = async (req, res, next) => {
		try {
			req.logout(() => {
				req.session.destroy(err => {
					if (err) {
						return next(
							CustomError.createError({
								name: 'LogoutError',
								cause: err,
								message: 'Error during logout',
								code: EErrors.AUTHENTICATION_ERROR,
							}),
						);
					}
					logger.info('User logged out successfully');
					res.redirect('/login');
				});
			});
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'LogoutError',
					cause: err,
					message: 'Error during logout',
					code: EErrors.AUTHENTICATION_ERROR,
				}),
			);
		}
	};

	getCurrentUser = async (req, res, next) => {
		try {
			let user = req.user;
			if (!user) {
				logger.warn('User not authenticated');
				return res.status(401).json({message: 'User not authenticated'});
			}
			user = new UserResponseDTO(user.toObject());
			return res.status(200).json({user});
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'GetCurrentUserError',
					cause: err,
					message: 'Error getting current user',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
	};

	githubLogin = async (req, res, next) => {
		try {
			passport.authenticate('github', {
				scope: ['user:email'],
			})(req, res, next);
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'GitHubLoginError',
					cause: err,
					message: 'Error during GitHub login',
					code: EErrors.AUTHENTICATION_ERROR,
				}),
			);
		}
	};

	githubCallback = async (req, res, next) => {
		passport.authenticate(
			'github',
			{failureRedirect: '/login'},
			(err, user, info) => {
				if (err) {
					return next(
						CustomError.createError({
							name: 'GitHubAuthError',
							cause: err,
							message: 'Error during GitHub authentication',
							code: EErrors.AUTHENTICATION_ERROR,
						}),
					);
				}
				if (!user) {
					logger.warn('No user returned from GitHub authentication');
					return res.redirect('/login');
				}
				req.logIn(user, function (err) {
					if (err) {
						return next(
							CustomError.createError({
								name: 'LoginError',
								cause: err,
								message: 'Error logging in user via GitHub',
								code: EErrors.AUTHENTICATION_ERROR,
							}),
						);
					}
					logger.debug('User logged in successfully via GitHub:', user);
					return res.redirect('/view/products');
				});
			},
		)(req, res, next);
	};

	renderForgotPasswordForm = async (req, res, next) => {
		try {
			// If the user is already logged in, redirect to profile page
			if (req.session.user) {
				return res.redirect('/profile');
			}
			// Otherwise, render the forgot-password view
			return res.render('forgot-password');
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'RenderForgotPasswordError',
					cause: err,
					message: 'Error rendering forgot password form',
					code: EErrors.UNAUTHORIZED_ACTION,
				}),
			);
		}
	};

	requestPasswordReset = async (req, res, next) => {
		try {
			logger.debug('Starting password reset process');
			const email = req.body.email;
			logger.debug(`Email: ${email}`);

			const token = await this.authService.generateResetToken(email);
			logger.debug(`Token: ${token}`);

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				port: 587,
				auth: {
					user: GOOGLE_EMAIL,
					pass: GOOGLE_PASS,
				},
			});

			const mailOptions = {
				from: GOOGLE_EMAIL,
				to: email,
				subject: 'Password Reset',
				html: `<html>
				<head>
					<title>Reset Password</title>
				</head>
				<body>
					<h1>Hello,</h1>
					<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
					<p>Please click on the following link, or paste it into your browser to complete the process:</p>
					<a href="http://localhost:${PORT}/api/sessions/reset-password?token=${token}&email=${email}">Reset Password</a>
					<p>This link will expire in one hour.</p>
					<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
				</body>
				</html>`,
			};

			await transporter.sendMail(mailOptions);
			logger.debug('Mail sent successfully');

			res.status(200).json({message: 'Password reset link sent.'});
		} catch (error) {
			logger.debug('Error in requestPasswordReset: ', error);

			next(error);
		}
	};

	renderResetPassword = async (req, res, next) => {
		logger.debug('Entered renderResetPassword with query:', req.query);

		const {token, email} = req.query;
		try {
			// Validate the token and email
			await this.authService.validateResetToken(email, token);
			// Render the reset password page
			res.render('reset-password', {token, email});
		} catch (error) {
			if (error.message === 'Invalid or expired reset token') {
				// Redirect to a view where the user can request a new reset email
				return res.redirect('/api/sessions/forgot-password');
			}
			next(error);
		}
	};

	resetPassword = async (req, res, next) => {
		logger.debug('Received body in resetPassword: ', req.body);

		try {
			const {email, token, newPassword} = req.body;

			await this.authService.validateResetToken(email, token);
			await this.authService.updatePassword(email, newPassword);

			res.status(200).json({message: 'Password updated successfully.'});
		} catch (error) {
			console.error('Error in resetPassword: ', error);

			next(error);
		}
	};
}

let authController;

export const initializeAuthController = async () => {
	if (!authController) {
		authController = new AuthController();
		await authController.init();
	}
	return authController;
};
