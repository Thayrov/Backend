import environment from '../config/config.js';
import mongoose from 'mongoose';

const {MONGO_URL} = environment;
export let isMongoConnected = false;

export const DAOFactory = async entity => {
	let DAO;

	switch (environment.PERSISTANCE) {
		case 'MONGO':
			// Conexión a MongoDB
			const atlasURI = MONGO_URL;
			mongoose.connect(atlasURI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				dbName: 'ecommerce',
			});

			const db = mongoose.connection;
			db.on('error', console.error.bind(console, 'MongoDB connection error:'));
			await new Promise((resolve, reject) => {
				db.once('open', () => {
					console.log('Connected to MongoDB');
					isMongoConnected = true;
					resolve();
				});
			});

			// Importar el DAO de MongoDB correspondiente
			DAO = await import(`./mongo/${entity}.mongo.js`);
			break;

		case 'MEMORY':
			DAO = await import(`./memory/${entity}.memory.js`);
			break;

		default:
			throw new Error('Persistence method not supported');
	}

	return DAO.default;
};
