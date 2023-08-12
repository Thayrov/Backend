import MongoSingleton from './mongo.config.js';
import MongoStore from 'connect-mongo';
import environment from './enviroment.config.js';
import session from 'express-session';

const {MONGO_URL, SESSION_SECRET} = environment;
export const configureSession = () => {
	//console.log('MongoSingleton has instance:', MongoSingleton.hasInstance());
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
		return (req, res, next) => next();
	}
};
