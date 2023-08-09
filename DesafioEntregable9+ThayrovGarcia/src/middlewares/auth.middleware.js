export const isAuthenticated = (req, res, next) => {
	console.log('Session:', req.session);

	if (req.isAuthenticated()) {
		console.log('User is authenticated:', req.user);
		return next();
	}
	console.log('User is not authenticated');
	return res.redirect('/login');
};

export const isAdmin = (req, res, next) => {
	isAuthenticated(req, res, () => {
		if (req.session.user && req.session.user.role === 'admin') {
			return next();
		} else {
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
		return res
			.status(403)
			.send('Access denied. Only users can perform this action.');
	}
};
