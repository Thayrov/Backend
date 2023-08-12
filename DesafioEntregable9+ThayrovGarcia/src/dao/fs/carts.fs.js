import {CartManager} from './managers/carts.manager.js';

class CartFSDAO {
	constructor() {
		this.manager = new CartManager('./dao/fs/db/carts.json');
	}

	async findAll() {
		return await this.manager.getCarts();
	}

	async findById(id) {
		return await this.manager.getCartById(id);
	}

	async create(cartData) {
		return await this.manager.createCart(cartData);
	}

	async update(id, updatedFields) {
		return await this.manager.updateCart(id, updatedFields);
	}

	async delete(id) {
		return await this.manager.deleteCart(id);
	}

	async addProduct(cartId, productData) {
		return await this.manager.addProductToCart(cartId, productData.product);
	}

	async deleteProduct(cartId, productId) {
		return await this.manager.deleteProductFromCart(cartId, productId);
	}
}

export default new CartFSDAO();
