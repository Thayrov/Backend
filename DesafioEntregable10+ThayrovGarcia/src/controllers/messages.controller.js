import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';
import {logger} from '../config/logger.config.js';

class MessagesController {
	constructor() {
		this.messageService = initializeMessageService();
	}

	async getAllMessages(req, res) {
		try {
			const messages = await this.messageService.getAllMessages();
			logger.info('Successfully retrieved all messages');
			res.send(messages);
		} catch (err) {
			logger.error('Error retrieving all messages: ' + err.message);
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
			logger.info('Successfully created a new message');

			res.send(newMessage);
		} catch (err) {
			logger.error('Error creating message: ' + err.message);

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
