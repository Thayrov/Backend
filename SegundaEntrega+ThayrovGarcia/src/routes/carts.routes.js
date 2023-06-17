import * as cartsController from '../controllers/carts.controller.js';

import express from 'express';

export const routerCarts = express.Router();

routerCarts.get('/:cid', cartsController.getCartById);
routerCarts.post('/:cid/product/:pid', cartsController.addProductToCart);
routerCarts.delete(
	'/:cid/products/:pid',
	cartsController.removeProductFromCart,
);
routerCarts.put('/:cid', cartsController.updateCartProducts);
routerCarts.put('/:cid/products/:pid', cartsController.updateProductQuantity);
routerCarts.delete('/:cid', cartsController.deleteCart);
