import {
	getCurrentUser,
	githubCallback,
	githubLogin,
	loginUser,
	registerUser,
} from '../controllers/auth.controller.js';

import express from 'express';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/github', githubLogin);
authRouter.get('/githubcallback', githubCallback);
authRouter.get('/current', getCurrentUser);

export default authRouter;
