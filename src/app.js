// Core modules
import path from 'path';

// Third-party modules
import compression from 'express-compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import handlebars from 'express-handlebars';
import passport from 'passport';
import swaggerUiExpress from 'swagger-ui-express';

// Configurations
import {isMainModule, rootDir} from './config/dirname.config.js';
import environment from './config/environment.config.js';
import {configureSession} from './config/session.config.js';
import iniPassport from './config/passport.config.js';
import {logger} from './config/logger.config.js';
import {specs} from './config/swagger.config.js';

// Middlewares
import errorHandler from './middlewares/error.middleware.js';

// Routes
import {errorRouter} from './routes/error.routes.js';
import {initializeAuthRoutes} from './routes/auth.routes.js';
import {initializeCartsRoutes} from './routes/carts.routes.js';
import {initializeProductsRoutes} from './routes/products.routes.js';
import {initializeViewsRoutes} from './routes/views.routes.js';
import {loggerRouter} from './routes/logger.routes.js';
import mockRouter from './routes/mock.routes.js';

// Environment's port
const {PORT} = environment;

// App asynchronous initialization
export const initializeApp = async () => {
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
  app.set('views', path.join(rootDir, 'views'));
  app.set('view engine', 'handlebars');

  // Static files
  app.use(express.static(path.join(rootDir, 'public')));

  // Logger test route
  app.use('/loggerTest', loggerRouter);

  // Swagger docs route
  app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

  // Initialize the routes
  const routerProducts = await initializeProductsRoutes();
  const viewsRouter = await initializeViewsRoutes();
  const authRouter = await initializeAuthRoutes();
  const routerCarts = await initializeCartsRoutes();

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

  // Return the app object for further use
  return app;
};

// This function will initialize the app and start listening on the specified port
const startServer = async () => {
  try {
    const app = await initializeApp();
    app.listen(PORT, () => {
      logger.info(`Server listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
  }
};

// Check if the script is being run directly
if (isMainModule) {
  // Initialize the app and start the server
  startServer();
}
