import {MessageManager} from './managers/messages.manager.js';

class MessageFSDAO {
	constructor() {
		this.manager = new MessageManager('./dao/fs/db/messages.json');
	}

	async getAll() {
		return await this.manager.getAllMessages();
	}

	async create(messageData) {
		return await this.manager.createMessage(messageData);
	}
}

export default new MessageFSDAO();
