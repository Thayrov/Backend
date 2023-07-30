import Message from '../dao/models/messages.model.js';

class MessageService {
	getAllMessages = async () => {
		const messages = await Message.find();
		return messages;
	};

	createMessage = async messageData => {
		const newMessage = await Message.create(messageData);
		return newMessage;
	};
}

export default MessageService;
