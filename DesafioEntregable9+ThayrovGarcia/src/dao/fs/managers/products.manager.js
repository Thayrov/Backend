import * as fs from 'fs/promises';

export class ProductManager {
	static #instance;
	constructor(path) {
		if (ProductManager.#instance) {
			console.log('Already connected');
			return ProductManager.#instance;
		}
		this.path = path;
		this.products = [];
		this.lastId = 0;
		this.connect();
		ProductManager.#instance = this;
		return this;
	}

	async connect() {
		try {
			const data = await fs.readFile(this.path, {encoding: 'utf-8'});
			if (data) {
				this.products = JSON.parse(data);
				this.lastId =
					this.products.length > 0
						? this.products[this.products.length - 1].id
						: 0;
			}
		} catch (error) {
			console.error(`Error initializing Product Manager: ${error.message}`);
		}
	}

	async initialize() {
		try {
			const data = await fs.readFile(this.path, {encoding: 'utf-8'});
			if (data) {
				this.products = JSON.parse(data);
				this.lastId =
					this.products.length > 0
						? this.products[this.products.length - 1].id
						: 0;
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

	async addProduct(productData) {
		if (
			!productData.title ||
			!productData.description ||
			!productData.price ||
			!productData.code ||
			!productData.stock ||
			!productData.category
		) {
			console.error('All fields are required');
			return null;
		}

		if (this.products.some(p => p.code === productData.code)) {
			console.error('Product with the same code already exists');
			return null;
		}

		this.lastId++;
		const newProduct = {
			id: this.lastId.toString(),
			title: productData.title,
			description: productData.description,
			code: productData.code,
			price: productData.price,
			status: productData.status === undefined ? true : productData.status,
			stock: productData.stock,
			category: productData.category,
			thumbnails: productData.thumbnails || [],
		};
		this.products.push(newProduct);
		await this.save();
		console.log('Product added successfully');
		return newProduct;
	}

	async getProducts(limit) {
		const products = limit ? this.products.slice(0, limit) : this.products;
		return products;
	}

	async getProductById(id) {
		const product = this.products.find(p => p.id === id);
		if (!product) {
			console.error('Product not found');
			return null;
		}
		return product;
	}

	async updateProduct(id, updatedFields) {
		const product = this.products.find(p => p.id === id);
		if (!product) {
			console.error('Product not found');
			return null;
		}
		const updatedProduct = {...product, ...updatedFields};
		this.products = this.products.map(p => (p.id === id ? updatedProduct : p));
		await this.save();
		console.log('Product updated successfully');
		return updatedProduct;
	}

	async deleteProduct(id) {
		const productIndex = this.products.findIndex(p => p.id === id);
		if (productIndex === -1) {
			console.error('Product not found');
			return null;
		}
		const deletedProduct = this.products.splice(productIndex, 1)[0];
		await this.save();
		console.log('Product deleted successfully');
		return deletedProduct;
	}
}
