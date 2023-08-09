import {MessageManager} from './managers/messages.manager.js';

const messageManager = new MessageManager('./dao/fs/db/messages.json');

export default {
	getAll: async () => messageManager.getAllMessages(),
	create: async messageData => messageManager.createMessage(messageData),
};
