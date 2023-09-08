import {ProductManager} from './managers/products.manager.js';

class ProductFSDAO {
	constructor() {
		this.manager = new ProductManager('./dao/fs/db/products.json');
	}

	async findAll({limit}) {
		return await this.manager.getProducts(limit);
	}

	async findById(id) {
		return await this.manager.getProductById(id);
	}

	async create(productData) {
		return await this.manager.addProduct(productData);
	}

	async update(id, updatedFields) {
		return await this.manager.updateProduct(id, updatedFields);
	}

	async delete(id) {
		return await this.manager.deleteProduct(id);
	}

	async findByCode(code) {
		return await this.manager.getProductByCode(code);
	}
}

export default new ProductFSDAO();
