import {loginUser, registerUser} from '../controllers/auth.controller.js';

import express from 'express';
import passport from 'passport';

const authRouter = express.Router();

authRouter.post(
	'/register',
	passport.authenticate('register', {
		successRedirect: '/profile',
		failureRedirect: '/register',
		failureFlash: true,
	}),
	registerUser,
);

authRouter.post(
	'/login',
	passport.authenticate('login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true,
	}),
	loginUser,
);

authRouter.get(
	'/github',
	passport.authenticate('github', {scope: ['user:email']}),
);

authRouter.get(
	'/githubcallback',
	passport.authenticate('github', {failureRedirect: '/login'}),
	(req, res) => {
		res.redirect('/view/products');
	},
);
export default authRouter;
