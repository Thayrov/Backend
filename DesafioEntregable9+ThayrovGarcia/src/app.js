import MongoStore from 'connect-mongo';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import db from './dao/db.js';
import environment from './config/config.js';
import {errorRouter} from './routes/error.routes.js';
import express from 'express';
import {fileURLToPath} from 'url';
import handlebars from 'express-handlebars';
import iniPassport from './config/passport.config.js';
import passport from 'passport';
import path from 'path';
import routerCarts from './routes/carts.routes.js';
import routerProducts from './routes/products.routes.js';
import session from 'express-session';
import viewsRouter from './routes/views.routes.js';

const {PORT, MONGO_URL, SESSION_SECRET} = environment;

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
iniPassport();

app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: MONGO_URL,
			ttl: 86400 * 7,
		}),
	}),
);

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/api/sessions', authRouter);
app.use('/', viewsRouter);
app.use('/error', errorRouter);

app.get('*', (req, res) => {
	return res.status(404).json({
		status: 'error',
		msg: 'Page not found',
		data: {},
	});
});

app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`);
});
