import MongoStore from 'connect-mongo';
import environment from './config.js';
import {isMongoConnected} from '../dao/factory.js';
import session from 'express-session';

const {MONGO_URL, SESSION_SECRET} = environment;

export const configureSession = () => {
	if (isMongoConnected) {
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
