import {DAOFactory} from '../dao/factory.js';
import {initializeProductService} from './products.service.js';
import {initializeTicketService} from './tickets.service.js';
import {logger} from '../config/logger.config.js';

export class CartService {
	async init() {
		this.cartDAO = await DAOFactory('carts');
		this.productService = await initializeProductService();
		this.ticketService = await initializeTicketService();
	}

	async createCart(cartData) {
		return await this.cartDAO.create(cartData);
	}

	async getCartById(cartId) {
		return await this.cartDAO.findById(cartId);
	}

	async addProductToCart(cartId, productId, quantity, user) {
		const productToAdd = await this.productService.getProductById(productId);
		if (!cartId || !productToAdd) {
			throw new Error('Cart or Product not found');
		}
		if (user.role === 'premium' && productToAdd.owner === user._id) {
			throw new Error('You cannot add your own product to the cart');
		}
		return await this.cartDAO.addProduct(cartId, {
			product: productId,
			quantity: quantity,
		});
	}

	async deleteProductFromCart(cartId, productId) {
		if (!cartId) {
			throw new Error('Cart not found');
		}
		const updatedCart = await this.cartDAO.deleteProduct(cartId, productId);
		return updatedCart;
	}

	async updateCart(cartId, products) {
		return await this.cartDAO.update(cartId, {products});
	}

	async updateProductQuantity(cartId, productId, quantity) {
		const cart = await this.getCartById(cartId);
		if (!cart) {
			logger.error('Cart not found.');
			throw new Error('Cart not found.');
		}
		if (!Array.isArray(cart.products)) {
			logger.error('Cart products not found or not an array.');
			throw new Error('Cart products not found or not an array.');
		}
		const productIndex = cart.products.findIndex(
			p => p.product && p.product._id.toString() === productId.toString(),
		);
		if (productIndex === -1) {
			logger.error('Product not found in cart.');
			throw new Error('Product not found in cart.');
		}
		cart.products[productIndex].quantity = quantity;
		return await this.cartDAO.update(cartId, cart);
	}

	async clearCart(cartId) {
		if (!cartId) {
			throw new Error('Cart not found');
		}
		return await this.cartDAO.update(cartId, {products: []});
	}

	async deleteCart(cartId) {
		return await this.cartDAO.delete(cartId);
	}

	async finalizePurchase(cartId, userEmail) {
		const cart = await this.getCartById(cartId);
		let totalAmount = 0;
		let unprocessedProducts = [];

		for (let item of cart.products) {
			const product = await this.productService.getProductById(item.product);
			if (product.stock >= item.quantity) {
				totalAmount += product.price * item.quantity;
				product.stock -= item.quantity;
				await this.productService.updateProduct(product._id, product);
			} else {
				unprocessedProducts.push(item.product);
			}
		}
		if (unprocessedProducts.length > 0) {
			logger.warn(
				'Some products could not be processed due to insufficient stock',
			);
		}
		const ticketData = {
			amount: totalAmount,
			purchaser: userEmail,
		};

		const ticket = await this.ticketService.createTicket(ticketData);

		cart.products = cart.products.filter(item =>
			unprocessedProducts.includes(item.product),
		);
		await this.updateCart(cartId, cart.products);

		return {
			ticket,
			unprocessedProducts,
		};
	}
}

let cartService;

export const initializeCartService = async () => {
	if (!cartService) {
		cartService = new CartService();
		await cartService.init();
	}
	return cartService;
};
