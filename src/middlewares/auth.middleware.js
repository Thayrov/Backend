import {logger} from '../config/logger.config.js';

export const isAuthenticated = (req, res, next) => {
	res.locals.userIsLoggedIn = req.isAuthenticated();

	if (req.isAuthenticated()) {
		return next();
	}

	if (!req.isAuthenticated()) {
		logger.warn('User is not authenticated');
		return res.status(401).send('Unauthorized');
	}
};

export const isAdmin = (req, res, next) => {
	res.locals.userIsAdmin = req.isAdmin();
	isAuthenticated(req, res, () => {
		if (req.user && req.user.role === 'admin') {
			return next();
		} else {
			logger.warn('Access attempt by non-admin user');
			return res
				.status(403)
				.send('Access denied. Only admins can perform this action.');
		}
	});
};

export const isUser = (req, res, next) => {
	isAuthenticated(req, res, () => {
		if (req.user && req.user.role === 'user') {
			return next();
		} else {
			logger.warn('Access attempt by non-user entity');
			return res
				.status(403)
				.send('Access denied. Only users can perform this action.');
		}
	});
};
