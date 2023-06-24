import Message from '../dao/models/messages.model.js';

export const getAllMessages = async () => {
	const messages = await Message.find();
	return messages;
};

export const createMessage = async messageData => {
	const newMessage = await Message.create(messageData);
	return newMessage;
};
