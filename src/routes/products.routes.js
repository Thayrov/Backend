import {isAdmin, isAuthenticated} from '../middlewares/auth.middleware.js';

import express from 'express';
import {initializeProductsController} from '../controllers/products.controller.js';

export const initializeProductsRoutes = async () => {
	const router = express.Router();
	const ProductsControllerInstance = await initializeProductsController();

	const {
		getAllProducts,
		getProductById,
		createProduct,
		updateProduct,
		deleteProduct,
	} = ProductsControllerInstance;

	router.get('/', getAllProducts);
	router.get('/:pid', getProductById);
	router.post('/', isAuthenticated, isAdmin, createProduct);
	router.put('/:pid', isAuthenticated, isAdmin, updateProduct);
	router.delete('/:pid', isAuthenticated, isAdmin, deleteProduct);
	return router;
};
