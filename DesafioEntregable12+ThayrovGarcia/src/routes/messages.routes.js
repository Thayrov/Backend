import {isAuthenticated, isUser} from '../middlewares/auth.middleware.js';

import {initializeMessagesRoutes} from '../controllers/messages.controller.js';
import express from 'express';

export const initializeMessagesRoutes = async () => {
	const router = express.Router();
	const MessagesControllerInstance = await initializeMessagesController();

	const {createMessage, getAllMessages} = MessagesControllerInstance;

	router.get('/', getAllMessages);
	router.post('/', isAuthenticated, isUser, createMessage);
	return router;
};
