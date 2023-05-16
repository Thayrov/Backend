import * as fs from 'fs';

export class ProductManager {
	constructor(path) {
		this.path = './src/products.json';
		this.products = [];
		this.lastId = 0;
	}

	async initialize() {
		try {
			const data = await fs.promises.readFile(this.path, {encoding: 'utf-8'});
			if (data) {
				this.products = JSON.parse(data);
				this.lastId = this.products[this.products.length - 1].id;
			}
		} catch (error) {
			console.error(`Error initializing Product Manager: ${error.message}`);
		}
	}
	async save() {
		try {
			const result = await fs.promises.writeFile(
				this.path,
				JSON.stringify(this.products, null, 2),
			);
			console.log('Product Manager saved successfully');
		} catch (error) {
			console.error(`Error saving Product Manager: ${error.message}`);
		}
	}

	async addProduct(product) {
		if (
			!product.title ||
			!product.description ||
			!product.price ||
			!product.thumbnail ||
			!product.code ||
			!product.stock
		) {
			console.error('All fields are required');
			return;
		}

		if (this.products.some(p => p.code === product.code)) {
			console.error('Product with the same code already exists');
			return;
		}

		this.lastId++;
		product.id = this.lastId;
		this.products.push(product);
		await this.save();
		console.log('Product added successfully');
	}

	async getProducts() {
		return this.products;
	}

	async getProductById(id) {
		const product = this.products.find(p => p.id === id);

		if (!product) {
			console.error('Product not found');
			return;
		}

		return product;
	}

	async updateProduct(id, updatedFields) {
		const index = this.products.findIndex(p => p.id === id);

		if (index === -1) {
			console.error('Product not found');
			return;
		}

		this.products[index] = {...this.products[index], ...updatedFields};
		await this.save();
		console.log('Product updated successfully');
	}

	async deleteProduct(id) {
		const index = this.products.findIndex(p => p.id === id);

		if (index === -1) {
			console.error('Product not found');
			return;
		}

		this.products.splice(index, 1);
		await this.save();
		console.log('Product deleted successfully');
	}
}

const manager = new ProductManager('./src/products.json');
(async function () {
	await manager.initialize();
})();
