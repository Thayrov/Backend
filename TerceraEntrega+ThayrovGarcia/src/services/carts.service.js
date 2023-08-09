import {DAOFactory} from '../dao/factory.js';
import {initializeProductService} from './products.service.js';
import {initializeTicketService} from './tickets.service.js';

export class CartService {
	async init() {
		this.cartDAO = await DAOFactory('carts');
		this.productService = await initializeProductService();
		this.ticketService = await initializeTicketService();
	}

	async createCart(cartData) {
		try {
			return await this.cartDAO.create(cartData);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getCartById(cartId) {
		try {
			return await this.cartDAO.findById(cartId);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async addProductToCart(cartId, productId) {
		try {
			const productToAdd = await this.productService.getProductById(productId);
			if (!productToAdd) {
				throw new Error('Product not found');
			}
			return await this.cartDAO.addProduct(cartId, {
				product: productId,
				quantity: 1,
			});
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async deleteProductFromCart(cartId, productId) {
		try {
			return await this.cartDAO.deleteProduct(cartId, productId);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async updateCart(cartId, products) {
		try {
			return await this.cartDAO.update(cartId, {products});
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async updateProductQuantity(cartId, productId, quantity) {
		try {
			const cart = await this.getCartById(cartId);
			const productIndex = cart.products.findIndex(
				p => p.product === productId,
			);
			if (productIndex === -1) {
				throw new Error('Product not found in cart');
			}
			cart.products[productIndex].quantity = quantity;
			return await this.cartDAO.update(cartId, cart);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async clearCart(cartId) {
		try {
			return await this.cartDAO.update(cartId, {products: []});
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async deleteCart(cartId) {
		try {
			return await this.cartDAO.delete(cartId);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async finalizePurchase(cartId, userEmail) {
		try {
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
		} catch (error) {
			console.error(error);
			throw error;
		}
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
