import * as cartsController from '../controllers/carts.controller.js';

import express from 'express';

export const routerCarts = express.Router();

routerCarts.post('/', cartsController.createCart);
routerCarts.get('/:cid', cartsController.getCartById);
routerCarts.post('/:cid/product/:pid', cartsController.addProductToCart);
routerCarts.delete(
	'/:cid/products/:pid',
	cartsController.deleteProductFromCart,
);
routerCarts.put('/:cid', cartsController.updateCart);
routerCarts.put('/:cid/products/:pid', cartsController.updateProductQuantity);
routerCarts.delete('/:cid', cartsController.clearCart);

export default routerCarts;
