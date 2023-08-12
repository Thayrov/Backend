import {DAOFactory} from '../dao/factory.js';

class MessageService {
	async init() {
		this.messageDAO = await DAOFactory('messages');
	}

	async getAllMessages() {
		return await this.messageDAO.getAll();
	}

	async createMessage(messageData) {
		return await this.messageDAO.create(messageData);
	}
}

let messageService;

export const initializeMessageService = async () => {
	if (!messageService) {
		messageService = new MessageService();
		await messageService.init();
	}
	return messageService;
};
