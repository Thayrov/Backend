class CartMemoryDAO {
	constructor() {
		this.carts = [];
		this.currentId = 1;
	}

	async create(cartData) {
		const newCart = {...cartData, _id: this.currentId++};
		this.carts.push(newCart);
		return newCart;
	}

	async findById(id) {
		return this.carts.find(cart => cart._id === id);
	}

	async update(id, cartData) {
		const index = this.carts.findIndex(c => c._id === id);
		if (index === -1) return null;
		this.carts[index] = {...this.carts[index], ...cartData};
		return this.carts[index];
	}

	async delete(id) {
		const index = this.carts.findIndex(c => c._id === id);
		if (index === -1) return null;
		const deletedCart = this.carts.splice(index, 1);
		return deletedCart[0];
	}

	async addProduct(cartId, productData) {
		const cart = this.carts.find(c => c._id === cartId);
		if (!cart) return null;
		cart.products.push(productData);
		return cart;
	}

	async deleteProduct(cartId, productId) {
		const cart = this.carts.find(c => c._id === cartId);
		if (!cart) return null;
		cart.products = cart.products.filter(p => p.product !== productId);
		return cart;
	}
}

export default new CartMemoryDAO();
