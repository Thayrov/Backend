import {logger} from '../config/logger.config.js';

export const addLogger = (req, res, next) => {
	req.logger = logger;
	next();
};
