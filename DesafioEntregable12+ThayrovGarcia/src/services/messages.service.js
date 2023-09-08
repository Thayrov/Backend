import {DAOFactory} from '../dao/factory.js';
import {logger} from '../config/logger.config.js';

class MessageService {
	async init() {
		this.messageDAO = await DAOFactory('messages');
	}

	async getAllMessages() {
		const messages = await this.messageDAO.getAll();
		logger.debug('All messages retrieved from the database.');
		return messages;
	}

	async createMessage(messageData) {
		const newMessage = await this.messageDAO.create(messageData);
		logger.info(`Message created with ID: ${newMessage._id}`);
		return newMessage;
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
