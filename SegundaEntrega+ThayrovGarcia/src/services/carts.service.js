import CartModel from '../dao/models/carts.model.js';

export const getCartById = async id => {
	const cart = await CartModel.findById(id).populate('products.product');
	return cart;
};

export const addProductToCart = async (cartId, productId) => {
	const cart = await CartModel.findById(cartId);
	if (!cart) {
		console.error('Cart not found');
		return null;
	}

	const existingProduct = cart.products.find(
		p => p.product.toString() === productId,
	);
	if (existingProduct) {
		existingProduct.quantity++;
		await cart.save();
		console.log('Product quantity updated successfully');
		return existingProduct;
	}

	cart.products.push({product: productId, quantity: 1});
	await cart.save();
	console.log('Product added to cart successfully');
	return cart.products[cart.products.length - 1];
};
