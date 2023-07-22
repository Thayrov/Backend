import {
	getCurrentUser,
	loginUser,
	registerUser,
} from '../controllers/auth.controller.js';

import express from 'express';
import passport from 'passport';

const authRouter = express.Router();

authRouter.post('/register', registerUser);

authRouter.post('/login', loginUser);

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

authRouter.get('/current', getCurrentUser);

export default authRouter;
