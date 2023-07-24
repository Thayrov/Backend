import * as messagesController from '../controllers/messages.controller.js';

import express from 'express';

export const routerMessages = express.Router();

routerMessages.get('/', messagesController.getAllMessages);
routerMessages.post('/', messagesController.createMessage);
