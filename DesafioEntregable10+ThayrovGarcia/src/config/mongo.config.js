import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';
import environment from './enviroment.config.js';
import {logger} from './logger.config.js';
import mongoose from 'mongoose';

const {MONGO_URL} = environment;
export default class MongoSingleton {
	static #mongoInstance;
	static #MAX_RETRIES = 3;

	static async connectToDB() {
		let retries = 0;
		while (retries < this.#MAX_RETRIES) {
			try {
				await mongoose.connect(MONGO_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
					dbName: 'ecommerce',
				});
				logger.info('Connected to MongoDB');

				return;
			} catch (err) {
				logger.error('Failed to connect to MongoDB:', err);
				retries++;
				logger.warn(`Attempt ${retries} of ${this.#MAX_RETRIES}`);
				await new Promise(resolve => setTimeout(resolve, 2000));
			}
		}
		next(
			CustomError.createError({
				name: 'MongoConnectionError',
				cause: new Error('Failed to connect to MongoDB'),
				message: 'Max retries reached. Failed to connect to MongoDB.',
				code: EErrors.DATABASE_ERROR,
			}),
		);
	}

	static async getInstance() {
		if (this.#mongoInstance) {
			logger.debug('Reusing existing MongoDB connection');
			return this.#mongoInstance;
		}
		logger.info('Creating new MongoDB connection instance');
		this.#mongoInstance = new MongoSingleton();
		await this.connectToDB();
		return this.#mongoInstance;
	}

	static hasInstance() {
		return !!this.#mongoInstance;
	}
}
