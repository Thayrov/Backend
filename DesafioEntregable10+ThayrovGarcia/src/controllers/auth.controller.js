import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';
import {UserResponseDTO} from '../dto/user.dto.js';
import {logger} from '../config/logger.config.js';
import passport from 'passport';

class AuthController {
	registerUser(req, res, next) {
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
				console.log('User registered and logged in successfully:', user);
				return res.redirect('/profile');
			});
		})(req, res, next);
	}

	loginUser(req, res, next) {
		passport.authenticate('login', (err, user, info) => {
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
				return res.redirect('/login');
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
		})(req, res, next);
	}

	renderLoginForm(req, res, next) {
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
	}

	renderRegisterForm(req, res, next) {
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
	}

	renderProfile(req, res, next) {
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
	}

	renderAdmin(req, res, next) {
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
	}

	handleLogout(req, res, next) {
		try {
			req.session.destroy();
			res.redirect('/login');
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
	}

	getCurrentUser(req, res) {
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
	}

	githubLogin(req, res, next) {
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
	}

	githubCallback(req, res, next) {
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
					console.log('User logged in successfully via GitHub:', user);
					return res.redirect('/view/products');
				});
			},
		)(req, res, next);
	}
}

export default new AuthController();
