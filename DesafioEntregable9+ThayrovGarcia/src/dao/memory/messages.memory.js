class MessageMemoryDAO {
	constructor() {
		this.messages = [];
		this.currentId = 1;
	}

	async getAll() {
		return this.messages;
	}

	async create(messageData) {
		const newMessage = {...messageData, _id: this.currentId++};
		this.messages.push(newMessage);
		return newMessage;
	}
}

export default new MessageMemoryDAO();
