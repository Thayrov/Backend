class ProductManager {
	constructor() {
		this.products = [];
		this.lastId = 0;
	}

	addProduct(product) {
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
		console.log('Product added successfully');
	}

	getProducts() {
		return this.products;
	}

	getProductById(id) {
		const product = this.products.find(p => p.id === id);

		if (!product) {
			console.error('Product not found');
			return;
		}

		return product;
	}
}

const manager = new ProductManager();

console.log(manager.getProducts());

manager.addProduct({
	title: 'producto prueba',
	description: 'Este es un producto prueba',
	price: 200,
	thumbnail: 'Sin imagen',
	code: 'abc123',
	stock: 25,
});

console.log(manager.getProducts());

manager.addProduct({
	title: 'producto repetido',
	description: 'Este es un producto repetido',
	price: 300,
	thumbnail: 'Sin imagen',
	code: 'abc123',
	stock: 10,
});

console.log(manager.getProductById(2));

console.log(manager.getProductById(1));
