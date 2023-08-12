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
		return await this.cartDAO.create(cartData);
	}

	async getCartById(cartId) {
		return await this.cartDAO.findById(cartId);
	}

	async addProductToCart(cartId, productId) {
		const productToAdd = await this.productService.getProductById(productId);
		if (!productToAdd) {
			throw new Error('Product not found');
		}
		return await this.cartDAO.addProduct(cartId, {
			product: productId,
			quantity: 1,
		});
	}

	async deleteProductFromCart(cartId, productId) {
		return await this.cartDAO.deleteProduct(cartId, productId);
	}

	async updateCart(cartId, products) {
		return await this.cartDAO.update(cartId, {products});
	}

	async updateProductQuantity(cartId, productId, quantity) {
		const cart = await this.getCartById(cartId);
		const productIndex = cart.products.findIndex(p => p.product === productId);
		if (productIndex === -1) {
			throw new Error('Product not found in cart');
		}
		cart.products[productIndex].quantity = quantity;
		return await this.cartDAO.update(cartId, cart);
	}

	async clearCart(cartId) {
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
