import {DAOFactory} from '../dao/factory.js';

class MessageService {
	async init() {
		this.messageDAO = await DAOFactory('messages');
	}

	async getAllMessages() {
		try {
			return await this.messageDAO.getAll();
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async createMessage(messageData) {
		try {
			return await this.messageDAO.create(messageData);
		} catch (error) {
			console.error(error);
			throw error;
		}
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
