import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';

class MessagesController {
	constructor() {
		this.messageService = initializeMessageService();
	}

	async getAllMessages(req, res) {
		try {
			const messages = await this.messageService.getAllMessages();
			res.send(messages);
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'GetAllMessagesError',
					cause: err,
					message: 'Error retrieving all messages',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
	}

	async createMessage(req, res) {
		try {
			const messageData = req.body;
			const newMessage = await this.messageService.createMessage(messageData);
			res.send(newMessage);
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'CreateMessageError',
					cause: err,
					message: 'Error creating message',
					code: EErrors.MESSAGE_VALIDATION_ERROR,
				}),
			);
		}
	}
}

export default new MessagesController();
