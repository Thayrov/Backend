import {isAuthenticated, isUser} from '../middlewares/auth.middleware.js';

import CartsController from '../controllers/carts.controller.js';
import express from 'express';

const {
	createCart,
	getCartById,
	addProductToCart,
	deleteProductFromCart,
	updateCart,
	updateProductQuantity,
	clearCart,
	finalizePurchase,
} = CartsController;

export const routerCarts = express.Router();

routerCarts.post('/', createCart);
routerCarts.get('/:cid', getCartById);
routerCarts.post(
	'/:cid/product/:pid',
	isAuthenticated,
	isUser,
	addProductToCart,
);
routerCarts.post('/:cid/purchase', isAuthenticated, isUser, finalizePurchase);
routerCarts.delete('/:cid/products/:pid', deleteProductFromCart);
routerCarts.put('/:cid', updateCart);
routerCarts.put('/:cid/products/:pid', updateProductQuantity);
routerCarts.delete('/:cid', clearCart);

export default routerCarts;