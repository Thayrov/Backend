import AuthService from '../services/auth.service.js';

export const registerUser = async (req, res) => {
	try {
		const user = await AuthService.registerUser(req.body);
		return res.status(201).json(user);
	} catch (err) {
		return res.status(400).json({message: err.message});
	}
};

export const loginUser = async (req, res) => {
	try {
		const {email, password} = req.body;

		if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
			const adminUser = {
				email: 'adminCoder@coder.com',
				role: 'admin',
			};
			req.session.user = adminUser;
			return res.redirect('/view/products');
		}

		const user = await AuthService.loginUser({email, password});
		req.session.user = user;
		return res.redirect('/view/products');
	} catch (err) {
		return res.status(400).json({message: err.message});
	}
};

export const renderLoginForm = (req, res) => {
	if (req.session.user) {
		return res.redirect('/profile');
	}
	return res.render('login');
};

export const renderRegisterForm = (req, res) => {
	if (req.session.user) {
		return res.redirect('/profile');
	}
	return res.render('register');
};

export const renderProfile = (req, res) => {
	const {user} = req.session;
	return res.render('profile', {user});
};

export const handleLogout = (req, res) => {
	req.session.destroy();
	res.redirect('/login');
};
