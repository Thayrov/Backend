import MongoSingleton from './mongo.config.js';
import MongoStore from 'connect-mongo';
import environment from './environment.config.js';
import session from 'express-session';

const {MONGO_URL, SESSION_SECRET} = environment;
export const configureSession = () => {
	if (MongoSingleton.hasInstance()) {
		return session({
			secret: SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			store: MongoStore.create({
				mongoUrl: MONGO_URL,
				ttl: 86400 * 7,
			}),
		});
	} else {
		logger.warn(
			'MongoDB instance not available. Session initialization skipped.',
		);
		return (req, res, next) => next();
	}
};
