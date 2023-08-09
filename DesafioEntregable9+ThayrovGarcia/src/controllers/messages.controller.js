import {initializeMessageService} from '../services/messages.service.js';

class MessagesController {
	constructor() {
		this.messageService = initializeMessageService();
	}
	async getAllMessages(req, res) {
		const messages = await this.messageService.getAllMessages();
		res.send(messages);
	}

	async createMessage(req, res) {
		const messageData = req.body;
		const newMessage = await this.messageService.createMessage(messageData);
		res.send(newMessage);
	}
}

export default new MessagesController();
