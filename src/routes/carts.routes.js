import {isAuthenticated, isUser} from '../middlewares/auth.middleware.js';

import express from 'express';
import {initializeCartsController} from '../controllers/carts.controller.js';

export const initializeCartsRoutes = async () => {
	const router = express.Router();
	const CartsControllerInstance = await initializeCartsController();

	const {
		createCart,
		getCartById,
		addProductToCart,
		deleteProductFromCart,
		updateCart,
		updateProductQuantity,
		clearCart,
		finalizePurchase,
	} = CartsControllerInstance;

	router.post('/', createCart);
	router.get('/:cid', getCartById);
	router.post('/:cid/product/:pid', isAuthenticated, isUser, addProductToCart);
	router.post('/:cid/purchase', isAuthenticated, isUser, finalizePurchase);
	router.delete('/:cid/products/:pid', deleteProductFromCart);
	router.put('/:cid', updateCart);
	router.put('/:cid/products/:pid', updateProductQuantity);
	router.delete('/:cid', clearCart);

	return router;
};
