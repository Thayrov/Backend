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
routerProducts.post('/', createProduct);
routerProducts.put('/:pid', updateProduct);
routerProducts.delete('/:pid', deleteProduct);

export default routerProducts;
