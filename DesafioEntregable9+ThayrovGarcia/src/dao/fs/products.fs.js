import {ProductManager} from './managers/products.manager.js';

const productManager = new ProductManager('./dao/fs/db/products.json');

export default {
	findAll: async ({limit}) => productManager.getProducts(limit),
	findById: async id => productManager.getProductById(id),
	create: async productData => productManager.addProduct(productData),
	update: async (id, updatedFields) =>
		productManager.updateProduct(id, updatedFields),
	delete: async id => productManager.deleteProduct(id),
	findByCode: async code => productManager.getProductByCode(code),
};
