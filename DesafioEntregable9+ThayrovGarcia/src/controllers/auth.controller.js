import AuthService from '../services/auth.service.js';
import passport from 'passport';

class AuthController {
	registerUser(req, res, next) {
		passport.authenticate('register', (err, user, info) => {
			if (err) {
				console.log('Error during registration:', err);
				return next(err);
			}
			if (!user) {
				console.log('No user returned from registration');
				return res.redirect('/register');
			}
			req.logIn(user, function (err) {
				if (err) {
					console.log('Error logging in user:', err);
					return next(err);
				}
				console.log('User registered and logged in successfully:', user);
				return res.redirect('/profile');
			});
		})(req, res, next);
	}

	loginUser(req, res, next) {
		passport.authenticate('login', (err, user, info) => {
			if (err) {
				console.log('Error during authentication:', err);
				return next(err);
			}
			if (!user) {
				console.log('No user returned from authentication');
				return res.redirect('/login');
			}
			req.logIn(user, function (err) {
				if (err) {
					console.log('Error logging in user:', err);
					return next(err);
				}
				console.log('User logged in successfully:', user);
				return res.redirect('/profile');
			});
		})(req, res, next);
	}

	renderLoginForm(req, res) {
		if (req.session.user) {
			return res.redirect('/profile');
		}
		return res.render('login');
	}

	renderRegisterForm(req, res) {
		if (req.session.user) {
			return res.redirect('/profile');
		}
		return res.render('register');
	}

	renderProfile(req, res) {
		let user = req.user;
		if (user.toObject) {
			user = user.toObject();
		}
		delete user.password;
		console.log("profile's user: ", user);
		return res.render('profile', {user});
	}

	renderAdmin(req, res) {
		const {user} = req.session;
		return res.render('admin', {user});
	}

	handleLogout(req, res) {
		req.session.destroy();
		res.redirect('/login');
	}

	getCurrentUser(req, res) {
		try {
			let user = req.user;
			if (!user) {
				return res.status(401).json({message: 'User not authenticated'});
			}
			user = user.toObject();
			delete user.password;
			return res.status(200).json({user});
		} catch (err) {
			return res
				.status(500)
				.json({message: 'Error getting current user', error: err.message});
		}
	}

	githubLogin(req, res, next) {
		passport.authenticate('github', {
			scope: ['user:email'],
		})(req, res, next);
	}

	githubCallback(req, res, next) {
		passport.authenticate(
			'github',
			{failureRedirect: '/login'},
			(err, user, info) => {
				if (err) {
					console.log('Error during GitHub authentication:', err);
					return next(err);
				}
				if (!user) {
					console.log('No user returned from GitHub authentication');
					return res.redirect('/login');
				}
				req.logIn(user, function (err) {
					if (err) {
						console.log('Error logging in user:', err);
						return next(err);
					}
					console.log('User logged in successfully via GitHub:', user);
					return res.redirect('/view/products');
				});
			},
		)(req, res, next);
	}
}

export default new AuthController();
