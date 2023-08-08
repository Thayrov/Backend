import environment from './config.js';
import mongoose from 'mongoose';

const {MONGO_URL} = environment;

export default class MongoSingleton {
	static #mongoInstance;

	constructor() {
		mongoose.connect(MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: 'ecommerce',
		});
	}

	static getInstance() {
		if (this.#mongoInstance) {
			// console.log('Already connected');
			return this.#mongoInstance;
		}
		this.#mongoInstance = new MongoSingleton();
		console.log('Connected to MongoDB');
		return this.#mongoInstance;
	}
}
