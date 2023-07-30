import MessageService from '../services/messages.service.js';

const messageService = new MessageService();

class MessagesController {
	async getAllMessages(req, res) {
		const messages = await messageService.getAllMessages();
		res.send(messages);
	}

	async createMessage(req, res) {
		const messageData = req.body;
		const newMessage = await messageService.createMessage(messageData);
		res.send(newMessage);
	}
}

export default new MessagesController();
