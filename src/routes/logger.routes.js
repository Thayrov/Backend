import express from 'express';
import {logger} from '../config/logger.config.js';

export const loggerRouter = express.Router();

loggerRouter.get('/', (req, res) => {
	logger.debug('This is a debug log');
	logger.http('This is an http log');
	logger.info('This is an info log');
	logger.warn('This is a warning log');
	logger.error('This is an error log');
	logger.fatal('This is a fatal log');
	res.send('Logs generated! Check your console and errors.log file.');
});
