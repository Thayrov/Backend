import {CartManager} from './managers/carts.manager.js';

const cartManager = new CartManager('./dao/fs/db/carts.json');

export default {
	findAll: async () => cartManager.getCarts(),
	findById: async id => cartManager.getCartById(id),
	create: async cartData => cartManager.createCart(cartData),
	update: async (id, updatedFields) =>
		cartManager.updateCart(id, updatedFields),
	delete: async id => cartManager.deleteCart(id),
	addProduct: async (cartId, productData) =>
		cartManager.addProductToCart(cartId, productData.product),
	deleteProduct: async (cartId, productId) =>
		cartManager.deleteProductFromCart(cartId, productId),
};
