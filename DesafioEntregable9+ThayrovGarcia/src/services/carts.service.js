import {DAOFactory} from '../dao/factory.js';
import {ProductService} from './products.service.js';

export class CartService {
	constructor() {
		this.cartDAO = DAOFactory('carts');
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
			const productToAdd = await ProductService.getProductById(productId);
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
}

export default new CartService();
