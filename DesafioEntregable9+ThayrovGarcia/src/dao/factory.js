import MongoSingleton from '../config/mongo.config.js';
import environment from '../config/enviroment.config.js';

export let isMongoConnected = false;

export const DAOFactory = async entity => {
	let DAO;

	switch (environment.PERSISTANCE) {
		case 'MONGO':
			await MongoSingleton.getInstance();

			DAO = await import(`./mongo/${entity}.mongo.js`);
			break;

		case 'MEMORY':
			DAO = await import(`./memory/${entity}.memory.js`);
			break;

		case 'FS':
			DAO = await import(`./fs/${entity}.fs.js`);
			break;

		default:
			throw new Error('Persistence method not supported');
	}

	return DAO.default;
};
