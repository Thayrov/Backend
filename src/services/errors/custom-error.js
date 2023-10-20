import {logger} from '../../config/logger.config.js';

export default class CustomError {
  static createError({name = 'Error', cause, message, code}) {
    const error = new Error(message, {cause});
    error.cause = cause;
    error.name = name;
    error.code = code;
    logger.error(`CustomError triggered: ${JSON.stringify(error)}`);
    return error;
  }
}
