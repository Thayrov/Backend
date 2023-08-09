import {isAdmin, isAuthenticated} from '../middlewares/auth.middleware.js';

import ProductsController from '../controllers/products.controller.js';
import express from 'express';

const {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} = ProductsController;

const routerProducts = express.Router();

routerProducts.get('/', getAllProducts);
routerProducts.get('/:pid', getProductById);
routerProducts.post('/', isAuthenticated, isAdmin, createProduct);
routerProducts.put('/:pid', isAuthenticated, isAdmin, updateProduct);
routerProducts.delete('/:pid', isAuthenticated, isAdmin, deleteProduct);

export default routerProducts;
