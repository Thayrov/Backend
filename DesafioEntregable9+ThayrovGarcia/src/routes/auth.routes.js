import AuthController from '../controllers/auth.controller.js';
import express from 'express';

const authRouter = express.Router();

const {registerUser, loginUser, githubLogin, githubCallback, getCurrentUser} =
	AuthController;

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/github', githubLogin);
authRouter.get('/githubcallback', githubCallback);
authRouter.get('/current', getCurrentUser);

export default authRouter;
