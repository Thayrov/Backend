const fs = require('fs').promises;

class ProductManager {
	constructor(path) {
		this.path = path;
	}

	async addProduct(product) {
		const products = await this.getProducts();
		const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
		const newProduct = {...product, id};
		products.push(newProduct);
		await fs.writeFile(this.path, JSON.stringify(products, null, 2));
		return newProduct;
	}

	async getProducts() {
		try {
			const data = await fs.readFile(this.path, 'utf-8');
			return JSON.parse(data);
		} catch (error) {
			return [];
		}
	}

	async getProductById(id) {
		const products = await this.getProducts();
		const product = products.find(p => p.id === id);
		if (!product) {
			throw new Error(`Product with id ${id} not found`);
		}
		return product;
	}

	async updateProduct(id, productToUpdate) {
		const products = await this.getProducts();
		const productIndex = products.findIndex(p => p.id === id);
		if (productIndex === -1) {
			throw new Error(`Product with id ${id} not found`);
		}
		const updatedProduct = {...products[productIndex], ...productToUpdate};
		products[productIndex] = updatedProduct;
		await fs.writeFile(this.path, JSON.stringify(products, null, 2));
		return updatedProduct;
	}

	async deleteProduct(id) {
		const products = await this.getProducts();
		const productIndex = products.findIndex(p => p.id === id);
		if (productIndex === -1) {
			throw new Error(`Product with id ${id} not found`);
		}
		const deletedProduct = products.splice(productIndex, 1)[0];
		await fs.writeFile(this.path, JSON.stringify(products, null, 2));
		return deletedProduct;
	}
}

const productManager = new ProductManager('./products.json');

(async () => {
	try {
		let products = await productManager.getProducts();
		console.log(products);

		const newProduct = await productManager.addProduct({
			title: 'producto prueba',
			description: 'Este es un producto prueba',
			price: 200,
			thumbnail: 'Sin imagen',
			code: 'abc123',
			stock: 25,
		});
		console.log(newProduct);

		products = await productManager.getProducts();
		console.log(products);

		const product = await productManager.getProductById(newProduct.id);
		console.log(product);

		const updatedProduct = await productManager.updateProduct(newProduct.id, {
			title: 'producto actualizado',
		});
		console.log(updatedProduct);

		const deletedProduct = await productManager.deleteProduct(newProduct.id);
		console.log(deletedProduct);

		products = await productManager.getProducts();
		console.log(products);
	} catch (error) {
		console.error(error);
	}
})();
