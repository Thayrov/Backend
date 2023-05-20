import {CartManager} from '../managers/cart-manager.js';
import express from 'express';

export const routerCarts = express.Router();

const manager = new CartManager();

routerCarts.get('/:cid', async (req, res) => {
	const cid = req.params.cid;
	const cart = await manager.getCartById(cid);
	if (cart) {
		res.send(cart.products);
	} else {
		res.status(404).send({error: 'Cart not found'});
	}
});

routerCarts.post('/:cid/product/:pid', async (req, res) => {
	const cid = req.params.cid;
	const pid = req.params.pid;
	const addedProduct = await manager.addProductToCart(cid, pid);
	if (addedProduct) {
		res.send(addedProduct);
	} else {
		res.status(404).send({error: 'Cart or Product not found'});
	}
});
