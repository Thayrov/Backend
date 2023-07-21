import {
	getViewAllProducts,
	getViewProductById,
} from '../controllers/products.controller.js';
import {
	handleLogout,
	renderAdmin,
	renderLoginForm,
	renderProfile,
	renderRegisterForm,
} from '../controllers/auth.controller.js';
import {isAdmin, isAuthenticated} from '../middlewares/auth.middleware.js';

import express from 'express';

const viewsRouter = express.Router();

viewsRouter.get('/view/products/', isAuthenticated, getViewAllProducts);
viewsRouter.get('/view/products/:pid', isAuthenticated, getViewProductById);
viewsRouter.get('/', renderLoginForm);
viewsRouter.get('/login', renderLoginForm);
viewsRouter.get('/register', renderRegisterForm);
viewsRouter.get('/profile', isAuthenticated, renderProfile);
viewsRouter.get('/admin', isAdmin, renderAdmin);
viewsRouter.get('/logout', handleLogout);
export default viewsRouter;
