import express from 'express';
import {initializeAuthController} from '../controllers/auth.controller.js';

export const initializeAuthRoutes = async () => {
	const router = express.Router();
	const AuthControllerInstance = await initializeAuthController();

	const {
		registerUser,
		loginUser,
		githubLogin,
		githubCallback,
		getCurrentUser,
		requestPasswordReset,
		resetPassword,
		renderForgotPasswordForm,
		renderResetPassword,
		toggleUserRole,
		uploadDocuments,
	} = AuthControllerInstance;

	router.post('/register', registerUser);
	router.post('/login', loginUser);
	router.get('/github', githubLogin);
	router.get('/githubcallback', githubCallback);
	router.get('/current', getCurrentUser);
	router.get('/forgot-password', renderForgotPasswordForm);
	router.post('/request-password-reset', requestPasswordReset);
	router.get('/reset-password', renderResetPassword);
	router.post('/reset-password', resetPassword);
	router.put('/premium/:uid', toggleUserRole);
	router.post('/:uid/documents', uploadDocuments);

	return router;
};
