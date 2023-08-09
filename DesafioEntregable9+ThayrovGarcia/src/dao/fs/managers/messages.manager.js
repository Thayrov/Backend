import * as fs from 'fs/promises';

export class MessageManager {
	static #instance;
	constructor(path) {
		if (MessageManager.#instance) {
			console.log('Already connected to MessageManager');
			return MessageManager.#instance;
		}
		this.path = path;
		this.messages = [];
		this.connect();
		MessageManager.#instance = this;
		return this;
	}

	async connect() {
		try {
			const data = await fs.readFile(this.path, {encoding: 'utf-8'});
			if (data) {
				this.messages = JSON.parse(data);
			}
		} catch (error) {
			console.error(`Error initializing Message Manager: ${error.message}`);
		}
	}

	async save() {
		try {
			await fs.writeFile(this.path, JSON.stringify(this.messages, null, 2));
			console.log('Message Manager saved successfully.');
		} catch (error) {
			console.error(`Error saving Message Manager: ${error.message}`);
		}
	}

	async getAllMessages() {
		return this.messages;
	}

	async createMessage(messageData) {
		this.messages.push(messageData);
		await this.save();
		console.log('Message added successfully');
		return messageData;
	}
}
