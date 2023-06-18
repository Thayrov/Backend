import CartModel from '../dao/models/carts.model.js';

export class CartService {
	async createCart(cartData) {
		try {
			const newCart = await CartModel.create(cartData);
			return newCart;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	async getCartById(cartId) {
		try {
			const populatedCart = await CartModel.findById(cartId)
				.populate({
					path: 'products.product',
					select: 'id title description price thumbnails code stock',
					model: 'Product',
				})
				.exec();

			if (!populatedCart) {
				return null;
			}

			populatedCart.products = populatedCart.products.map(product => {
				return {
					_id: product.product?._id?.toString(),
					quantity: product.quantity,
				};
			});

			console.log('Populated Cart:', populatedCart);

			return populatedCart;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async addProductToCart(cartId, productId, quantity) {
		try {
			const cart = await CartModel.findById(cartId);
			if (!cart) {
				return null;
			}
			const existingProduct = cart.products.find(
				item => item.product.toString() === productId,
			);
			if (existingProduct) {
				existingProduct.quantity += quantity;
			} else {
				cart.products.push({product: productId, quantity: quantity});
			}
			const updatedCart = await cart.save();
			return updatedCart;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async deleteProductFromCart(cartId, productId) {
		try {
			await CartModel.updateOne(
				{_id: cartId},
				{$pull: {products: {_id: productId}}},
			);
		} catch (error) {
			throw error;
		}
	}

	async updateCart(cartId, products) {
		try {
			await CartModel.updateOne({_id: cartId}, {products});
		} catch (error) {
			throw error;
		}
	}

	async updateProductQuantity(cartId, productId, quantity) {
		try {
			await CartModel.updateOne(
				{_id: cartId, 'products._id': productId},
				{$set: {'products.$.quantity': quantity}},
			);
		} catch (error) {
			throw error;
		}
	}

	async clearCart(cartId) {
		try {
			await CartModel.updateOne({_id: cartId}, {products: []});
		} catch (error) {
			throw error;
		}
	}
}
