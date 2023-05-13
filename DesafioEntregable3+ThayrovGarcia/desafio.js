const fs = require('fs').promises;

class ProductManager {
	constructor(path) {
		this.path = path;
		this.products = [];
		this.lastId = 0;
	}

	async initialize() {
		try {
			const data = await fs.readFile(this.path, 'utf-8');
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
			await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
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

const manager = new ProductManager('./products.json');
(async function () {
	await manager.initialize();

	console.log(await manager.getProducts());

	await manager.addProduct({
		title: 'producto prueba',
		description: 'Este es un producto prueba',
		price: 200,
		thumbnail: 'Sin imagen',
		code: 'abc123',
		stock: 25,
	});

	console.log(await manager.getProducts());

	await manager.addProduct({
		title: 'producto repetido',
		description: 'Este es un producto repetido',
		price: 300,
		thumbnail: 'Sin imagen',
		code: 'abc123',
		stock: 10,
	});

	await manager.addProduct({
		title: 'producto nuevo',
		description: 'Este es un producto nuevo',
		price: 300,
		thumbnail: 'Sin imagen',
		code: 'def456',
		stock: 10,
	});

	console.log(await manager.getProductById(2));

	console.log(await manager.getProductById(1));

	await manager.updateProduct(2, {stock: 20});

	console.log(await manager.getProductById(2));

	await manager.deleteProduct(2);

	console.log(await manager.getProducts());
})();
