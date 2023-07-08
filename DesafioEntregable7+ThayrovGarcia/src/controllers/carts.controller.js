import {CartService} from '../services/carts.service.js';

const cartService = new CartService();

export const createCart = async (req, res) => {
	try {
		const cartData = req.body;
		const newCart = await cartService.createCart(cartData);
		res.status(201).json(newCart);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
};

export const getCartById = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const cart = await cartService.getCartById(cartId);
		if (cart) {
			res.json(cart);
		} else {
			res.status(404).json({error: 'Cart not found'});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
};

export const addProductToCart = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const productId = req.params.pid;
		const quantity = req.body.quantity;
		const updatedCart = await cartService.addProductToCart(
			cartId,
			productId,
			quantity,
		);
		if (updatedCart) {
			res.json(updatedCart);
		} else {
			res.status(404).json({error: 'Cart or Product not found'});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
};

export const deleteProductFromCart = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const productId = req.params.pid;

		await cartService.deleteProductFromCart(cartId, productId);

		res.status(200).json({message: 'Product deleted from cart successfully'});
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
};

export const updateCart = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const products = req.body.products;

		await cartService.updateCart(cartId, products);

		res.status(200).json({message: 'Cart updated successfully'});
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
};

export const updateProductQuantity = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const productId = req.params.pid;
		const quantity = req.body.quantity;

		await cartService.updateProductQuantity(cartId, productId, quantity);

		res.status(200).json({message: 'Product quantity updated successfully'});
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
};

export const clearCart = async (req, res) => {
	try {
		const cartId = req.params.cid;

		await cartService.clearCart(cartId);

		res.status(200).json({message: 'Cart cleared successfully'});
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
};
