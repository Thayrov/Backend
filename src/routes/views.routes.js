import {isAdmin, isAuthenticated} from '../middlewares/auth.middleware.js';

import {ensureCart, productAdded} from '../middlewares/session.middleware.js';
import express from 'express';
import {initializeAuthController} from '../controllers/auth.controller.js';
import {initializeProductsController} from '../controllers/products.controller.js';
import {initializeCartsController} from '../controllers/carts.controller.js';

export const initializeViewsRoutes = async () => {
  const router = express.Router();
  const ProductsControllerInstance = await initializeProductsController();
  const AuthControllerInstance = await initializeAuthController();
  const CartsControllerInstance = await initializeCartsController();
  const {getViewAllProducts, getViewProductById} = ProductsControllerInstance;
  const {renderCart} = CartsControllerInstance;

  const {
    handleLogout,
    renderAdmin,
    renderLoginForm,
    renderProfile,
    renderRegisterForm,
    renderAdminUsers,
  } = AuthControllerInstance;

  router.get('/view/products/', productAdded, ensureCart, isAuthenticated, getViewAllProducts);
  router.get('/view/products/:pid', isAuthenticated, getViewProductById);
  router.get('/', renderLoginForm);
  router.get('/login', renderLoginForm);
  router.get('/register', renderRegisterForm);
  router.get('/profile', isAuthenticated, renderProfile);
  router.get('/admin', isAdmin, renderAdmin);
  router.get('/logout', handleLogout);
  router.get('/admin-users', isAdmin, renderAdminUsers);
  router.get('/cart', isAuthenticated, ensureCart, renderCart);

  return router;
};
