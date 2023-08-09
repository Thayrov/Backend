import environment from './enviroment.config.js';
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
				console.log('Connected to MongoDB');

				return;
			} catch (error) {
				console.error('Failed to connect to MongoDB:', error);
				retries++;
				console.log(`Attempt ${retries} of ${this.#MAX_RETRIES}`);
				await new Promise(resolve => setTimeout(resolve, 2000));
			}
		}
		throw new Error('Max retries reached. Failed to connect to MongoDB.');
	}

	static async getInstance() {
		if (this.#mongoInstance) {
			// console.log('Already connected');
			return this.#mongoInstance;
		}
		this.#mongoInstance = new MongoSingleton();
		await this.connectToDB();
		return this.#mongoInstance;
	}

	static hasInstance() {
		return !!this.#mongoInstance;
	}
}
