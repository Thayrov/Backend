import MongoStore from 'connect-mongo';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import db from './dao/db.js';
import express from 'express';
import {fileURLToPath} from 'url';
import handlebars from 'express-handlebars';
import iniPassport from './config/passport.config.js';
import path from 'path';
import routerCarts from './routes/carts.routes.js';
import routerProducts from './routes/products.routes.js';
import session from 'express-session';
import viewsRouter from './routes/views.routes.js';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(
	session({
		secret: 'secret-key',
		resave: true,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl:
				'mongodb+srv://thayrovg:m4FAi7aVYaNKXNyT@backend-cluster.8mvp8qv.mongodb.net/?retryWrites=true&w=majority',
			ttl: 86400 * 7,
		}),
	}),
);
iniPassport();

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

app.get('*', (req, res) => {
	return res.status(404).json({
		status: 'error',
		msg: 'Page not found',
		data: {},
	});
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
