import {logger} from '../config/logger.config.js';

export const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		logger.info('User is authenticated:', req.user);
		return next();
	}
	logger.warn('User is not authenticated');
	return res.redirect('/login');
};

export const isAdmin = (req, res, next) => {
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
	if (req.session.user && req.session.user.role === 'user') {
		return next();
	} else {
		logger.warn('Access attempt by non-user entity');
		return res
			.status(403)
			.send('Access denied. Only users can perform this action.');
	}
};
