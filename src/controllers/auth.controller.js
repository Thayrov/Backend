import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';
import {UserResponseDTO} from '../dto/user.dto.js';
import {ensureCart} from '../middlewares/session.middleware.js';
import {initializeAuthService} from '../services/auth.service.js';
import {logger} from '../config/logger.config.js';
import passport from 'passport';
import {uploadMiddleware} from '../middlewares/multer.middleware.js';

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
				} else {
					req.logIn(user, async err => {
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
						const userId = req.user._id;
						await this.authService.updateLastUserConnection(userId, new Date());
						if (!res.headersSent) {
							return res.redirect('/profile');
						}
					});
				}
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
			const email = req.body.email;
			await this.authService.requestPasswordReset(email);
			res.status(200).json({message: 'Password reset link sent.'});
		} catch (error) {
			next(
				CustomError.createError({
					name: 'requestPasswordResetError',
					cause: error,
					message: 'Error requesting Password Reset',
					code: EErrors.INTERNAL_SERVER_ERROR,
				}),
			);
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
				return res.redirect('/api/users/forgot-password');
			}
			next(
				CustomError.createError({
					name: 'renderResetPasswordError',
					cause: error,
					message: 'Error rendering Reset Password',
					code: EErrors.INTERNAL_SERVER_ERROR,
				}),
			);
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
			logger.error('Error in resetPassword: ', error);

			res.status(500).json({
				status: 'error',
				error: error.message,
			});
		}
	};
	toggleUserRole = async (req, res, next) => {
		try {
			const {uid} = req.params;
			const updatedUser = await this.authService.toggleUserRole(uid);
			return res.status(200).json({message: 'User role updated', updatedUser});
		} catch (error) {
			return next(
				CustomError.createError({
					name: 'ToggleRoleError',
					cause: error,
					message: 'Error toggling user role',
					code: EErrors.INTERNAL_SERVER_ERROR,
				}),
			);
		}
	};
	uploadDocuments = async (req, res, next) => {
		uploadMiddleware(req, res, async err => {
			if (err) {
				return res.status(500).json({message: 'Upload failed', err});
			}

			const userId = req.params.uid;
			const files = req.files;
			const documents = files.map(file => ({
				name: file.originalname,
				reference: file.path,
			}));

			try {
				const updatedUser = await this.authService.addDocumentsToUser(
					userId,
					documents,
				);
				return res
					.status(200)
					.json({message: 'Documents uploaded', updatedUser});
			} catch (error) {
				return res.status(500).json({message: 'Database update failed', error});
			}
		});
	};

	getAllUsers = async (req, res, next) => {
		try {
			const simplifiedUsers = await this.authService.getAllUsers();
			res.status(200).json(simplifiedUsers);
		} catch (err) {
			next(
				CustomError.createError({
					name: 'getAllUsersError',
					cause: err,
					message: 'Error getting All Users',
					code: EErrors.INTERNAL_SERVER_ERROR,
				}),
			);
		}
	};
	cleanupInactiveUsers = async (req, res, next) => {
		try {
			const result = await this.authService.removeInactiveUsersAndNotify();
			res.status(200).json(result);
		} catch (err) {
			next(
				CustomError.createError({
					name: 'cleanupInactiveUsersError',
					cause: err,
					message: 'Error cleaning Inactive Users',
					code: EErrors.INTERNAL_SERVER_ERROR,
				}),
			);
		}
	};
	renderAdminUsers = async (req, res, next) => {
		try {
			const users = await this.authService.fetchCompleteUsers();
			return res.render('admin-users', {users});
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'RenderAdminUsersError',
					cause: err,
					message: 'Error rendering admin users page',
					code: EErrors.INTERNAL_SERVER_ERROR,
				}),
			);
		}
	};

	deleteUserById = async (req, res, next) => {
		try {
			const {uid} = req.params;
			await this.authService.removeUserById(uid);
			return res.status(200).json({message: 'User deleted successfully.'});
		} catch (error) {
			return next(
				CustomError.createError({
					name: 'DeleteUserError',
					cause: error,
					message: 'Error deleting user',
					code: EErrors.INTERNAL_SERVER_ERROR,
				}),
			);
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
