import {CartService} from '../services/carts.service.js';

class CartsController {
	constructor() {
		this.cartService = new CartService();
	}

	createCart = async (req, res) => {
		try {
			const cartData = req.body;
			const newCart = await this.cartService.createCart(cartData);
			res.status(201).json(newCart);
		} catch (error) {
			console.error(error);
			res.status(500).json({error: 'Internal server error'});
		}
	};

	getCartById = async (req, res) => {
		try {
			const cartId = req.params.cid;
			const cart = await this.cartService.getCartById(cartId);
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

	addProductToCart = async (req, res) => {
		try {
			const cartId = req.params.cid;
			const productId = req.params.pid;
			const quantity = req.body.quantity;
			const updatedCart = await this.cartService.addProductToCart(
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

	deleteProductFromCart = async (req, res) => {
		try {
			const cartId = req.params.cid;
			const productId = req.params.pid;

			await this.cartService.deleteProductFromCart(cartId, productId);

			res.status(200).json({message: 'Product deleted from cart successfully'});
		} catch (error) {
			console.error(error);
			res.status(500).json({error: 'Internal server error'});
		}
	};

	updateCart = async (req, res) => {
		try {
			const cartId = req.params.cid;
			const products = req.body.products;

			await this.cartService.updateCart(cartId, products);

			res.status(200).json({message: 'Cart updated successfully'});
		} catch (error) {
			console.error(error);
			res.status(500).json({error: 'Internal server error'});
		}
	};

	updateProductQuantity = async (req, res) => {
		try {
			const cartId = req.params.cid;
			const productId = req.params.pid;
			const quantity = req.body.quantity;

			await this.cartService.updateProductQuantity(cartId, productId, quantity);

			res.status(200).json({message: 'Product quantity updated successfully'});
		} catch (error) {
			console.error(error);
			res.status(500).json({error: 'Internal server error'});
		}
	};

	clearCart = async (req, res) => {
		try {
			const cartId = req.params.cid;

			await this.cartService.clearCart(cartId);

			res.status(200).json({message: 'Cart cleared successfully'});
		} catch (error) {
			console.error(error);
			res.status(500).json({error: 'Internal server error'});
		}
	};
}

export default new CartsController();
