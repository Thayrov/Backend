import {DAOFactory} from '../dao/factory.js';

class MessageService {
	constructor() {
		this.messageDAO = DAOFactory('messages');
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

export default new MessageService();
