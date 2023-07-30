import {isAdmin, isAuthenticated} from '../middlewares/auth.middleware.js';

import AuthController from '../controllers/auth.controller.js';
import ProductsController from '../controllers/products.controller.js';
import express from 'express';

const viewsRouter = express.Router();

const {getViewAllProducts, getViewProductById} = ProductsController;

const {
	handleLogout,
	renderAdmin,
	renderLoginForm,
	renderProfile,
	renderRegisterForm,
} = AuthController;

viewsRouter.get('/view/products/', isAuthenticated, getViewAllProducts);
viewsRouter.get('/view/products/:pid', isAuthenticated, getViewProductById);
viewsRouter.get('/', renderLoginForm);
viewsRouter.get('/login', renderLoginForm);
viewsRouter.get('/register', renderRegisterForm);
viewsRouter.get('/profile', isAuthenticated, renderProfile);
viewsRouter.get('/admin', isAdmin, renderAdmin);
viewsRouter.get('/logout', handleLogout);

export default viewsRouter;
