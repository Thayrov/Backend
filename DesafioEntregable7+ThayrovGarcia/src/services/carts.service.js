import CartModel from '../dao/models/carts.model.js';
import {ProductService} from './products.service.js';

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
					select: 'title description code price stock thumbnails',
					model: 'Product',
				})
				.exec();

			if (!populatedCart) {
				return null;
			}

			populatedCart.products = populatedCart.products.map(product => {
				const {
					_id,
					quantity,
					product: {title, description, code, price, stock, thumbnails} = {},
				} = product;
				return {
					_id: _id.toString(),
					quantity,
					title: title || '',
					description: description || '',
					code: code || '',
					price,
					stock,
					thumbnails,
				};
			});

			console.log('Populated Cart:', populatedCart);

			return populatedCart;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async addProductToCart(cartId, productId) {
		try {
			const productToAdd = await ProductService.getProductById(productId);

			if (!productToAdd) {
				throw new Error('Product not found');
			}

			let cart = await CartModel.findOneAndUpdate(
				{_id: cartId, 'products.product': productToAdd._id},
				{
					$inc: {'products.$.quantity': 1},
				},
				{new: true},
			);

			if (!cart) {
				cart = await CartModel.findByIdAndUpdate(
					cartId,
					{
						$push: {products: {product: productToAdd._id, quantity: 1}},
					},
					{new: true},
				);
			}

			return cart;
		} catch (error) {
			throw new Error(error);
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
