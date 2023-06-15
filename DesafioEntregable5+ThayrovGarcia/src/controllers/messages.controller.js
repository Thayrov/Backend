import * as messageService from '../services/messages.service.js';

export const getAllMessages = async (req, res) => {
	const messages = await messageService.getAllMessages();
	res.send(messages);
};

export const createMessage = async (req, res) => {
	const messageData = req.body;
	const newMessage = await messageService.createMessage(messageData);
	res.send(newMessage);
};
