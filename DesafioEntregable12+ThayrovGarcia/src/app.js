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
import {initializeAuthRoutes} from './routes/auth.routes.js';
import {initializeProductsRoutes} from './routes/products.routes.js';
import {initializeViewsRoutes} from './routes/views.routes.js';
import {logger} from './config/logger.config.js';
import mockRouter from './routes/mock.routes.js';
import passport from 'passport';
import path from 'path';
import routerCarts from './routes/carts.routes.js';

const {PORT} = environment;

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const initializeApp = async () => {
	const app = express();

	// Middleware setup
	app.use(compression());
	app.use(express.json());
	app.use(express.urlencoded({extended: true}));
	app.use(cookieParser());
	iniPassport();
	app.use(configureSession());
	app.use(passport.initialize());
	app.use(passport.session());

	// Handlebars setup
	app.engine('handlebars', handlebars.engine());
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'handlebars');

	// Static files
	app.use(express.static(path.join(__dirname, 'public')));

	// Logger test route
	app.get('/loggerTest', (req, res) => {
		logger.debug('This is a debug log');
		logger.http('This is an http log');
		logger.info('This is an info log');
		logger.warn('This is a warning log');
		logger.error('This is an error log');
		logger.fatal('This is a fatal log');
		res.send('Logs generated! Check your console and errors.log file.');
	});

	// Initialize the routes
	const routerProducts = await initializeProductsRoutes();
	const viewsRouter = await initializeViewsRoutes();
	const authRouter = await initializeAuthRoutes();

	// Route setup
	app.use('/api/products', routerProducts);
	app.use('/api/carts', routerCarts);
	app.use('/api/users', authRouter);
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

	// Error handling middleware
	app.use(errorHandler);

	// Server initialization
	app.listen(PORT, () => {
		logger.info(`Server listening at http://localhost:${PORT}`);
	});
};

// Initialize the app
initializeApp();
