import * as cartService from '../services/carts.service.js';

export const getCartById = async (req, res) => {
	const id = req.params.cid;
	const cart = await cartService.getCartById(id);
	if (cart) {
		res.send(cart.products);
	} else {
		res.status(404).send({error: 'Cart not found'});
	}
};

export const addProductToCart = async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	const addedProduct = await cartService.addProductToCart(cartId, productId);
	if (addedProduct) {
		res.send(addedProduct);
	} else {
		res.status(404).send({error: 'Cart or Product not found'});
	}
};
