import * as productsController from '../controllers/products.controller.js';

import express from 'express';

export const routerProducts = express.Router();

routerProducts.get('/', productsController.getAllProducts);
routerProducts.get('/:pid', productsController.getProductById);
routerProducts.post('/', productsController.createProduct);
routerProducts.put('/:pid', productsController.updateProduct);
routerProducts.delete('/:pid', productsController.deleteProduct);
