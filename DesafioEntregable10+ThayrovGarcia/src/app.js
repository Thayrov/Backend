import {addLogger} from './middlewares/logger.middleware.js';
import authRouter from './routes/auth.routes.js';
import compression from 'express-compression';
import {configureSession} from './config/session.config.js';
import cookieParser from 'cookie-parser';
import environment from './config/enviroment.config.js';
import errorHandler from './middlewares/error.middleware.js';
import {errorRouter} from './routes/error.routes.js';
import express from 'express';
import {fileURLToPath} from 'url';
import handlebars from 'express-handlebars';
import iniPassport from './config/passport.config.js';
import {logger} from './config/logger.config.js';
import mockRouter from './routes/mock.routes.js';
import passport from 'passport';
import path from 'path';
import routerCarts from './routes/carts.routes.js';
import routerProducts from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';

const {PORT} = environment;

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();

app.use(compression());
app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
iniPassport();

app.use(configureSession());

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/loggerTest', (req, res) => {
	req.logger.debug('This is a debug log');
	req.logger.http('This is an http log');
	req.logger.info('This is an info log');
	req.logger.warning('This is a warning log');
	req.logger.error('This is an error log');
	req.logger.fatal('This is a fatal log');
	res.send('Logs generated! Check your console and errors.log file.');
});

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/api/sessions', authRouter);
app.use('/', viewsRouter);
app.use('/mockingproducts', mockRouter);
app.get('*', (req, res) => {
	return res.status(404).json({
		status: 'error',
		msg: 'Page not found',
		data: {},
	});
});
app.use('/error', errorRouter);
app.use(errorHandler);

app.listen(PORT, () => {
	logger.info(`Server listening at http://localhost:${PORT}`);
});
