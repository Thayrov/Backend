import MessageModel from './models/messages.model.js';

class MessageMongoDAO {
	async getAll() {
		return await MessageModel.find();
	}

	async create(messageData) {
		return await MessageModel.create(messageData);
	}
}

export default new MessageMongoDAO();
