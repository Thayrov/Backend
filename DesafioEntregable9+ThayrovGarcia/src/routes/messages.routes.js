import {isAuthenticated, isUser} from '../middlewares/auth.middleware.js';

import MessagesController from '../controllers/messages.controller.js';
import express from 'express';
const {createMessage, getAllMessages} = MessagesController;

export const routerMessages = express.Router();

routerMessages.get('/', getAllMessages);
routerMessages.post('/', isAuthenticated, isUser, createMessage);
