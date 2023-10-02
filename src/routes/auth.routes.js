import express from 'express';
import {initializeAuthController} from '../controllers/auth.controller.js';
import {isAdmin} from '../middlewares/auth.middleware.js';

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
		getAllUsers,
		cleanupInactiveUsers,
		deleteUserById,
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
	router.get('/all-users', getAllUsers);
	router.delete('/cleanup-users', cleanupInactiveUsers);
	router.delete('/delete-user/:uid', isAdmin, deleteUserById);

	return router;
};
