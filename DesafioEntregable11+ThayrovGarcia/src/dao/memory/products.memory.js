class ProductMemoryDAO {
	constructor() {
		this.products = [];
		this.currentId = 1;
	}

	async create(product) {
		const newProduct = {...product, _id: this.currentId++};
		this.products.push(newProduct);
		return newProduct;
	}

	async findAll() {
		return this.products;
	}

	async findByCode(code) {
		return this.products.find(product => product.code === code);
	}

	async update(code, updatedProduct) {
		const index = this.products.findIndex(p => p.code === code);
		if (index === -1) return null;

		this.products[index] = {...this.products[index], ...updatedProduct};
		return this.products[index];
	}

	async delete(code) {
		const index = this.products.findIndex(p => p.code === code);
		if (index === -1) return null;

		const deletedProduct = this.products.splice(index, 1);
		return deletedProduct[0];
	}
}

export default new ProductMemoryDAO();
