export const isAuthenticated = (req, res, next) => {
	if (req.session.user) {
		return next();
	} else {
		return res.redirect('/login');
	}
};

export const isAdmin = (req, res, next) => {
	if (req.session.user && req.session.user.role === 'admin') {
		return next();
	} else {
		return res.redirect('/login');
	}
};
