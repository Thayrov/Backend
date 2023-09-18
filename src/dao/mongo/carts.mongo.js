import CartModel from './models/carts.model.js';
import mongoose from 'mongoose';

class CartMongoDAO {
	async create(cartData) {
		return await CartModel.create(cartData);
	}

	async findById(id) {
		return await CartModel.findById(id)
			.populate({
				path: 'products.product',
				select: 'title description code price stock thumbnails',
				model: 'Product',
			})
			.exec();
	}

	async update(id, cartData) {
		return await CartModel.findByIdAndUpdate(id, cartData, {new: true});
	}

	async delete(id) {
		return await CartModel.findByIdAndDelete(id);
	}

	async addProduct(cartId, productData) {
		const cart = await CartModel.findById(cartId);
		cart.products.push(productData);
		return await cart.save();
	}
	async deleteProduct(cartId, productId) {
		const cart = await CartModel.findById(cartId);
		if (!cart) {
			throw new Error('Cart not found');
		}
		const result = await CartModel.updateOne(
			{_id: cartId},
			{$pull: {products: {product: new mongoose.Types.ObjectId(productId)}}},
		);
		if (result.nModified === 0) {
			throw new Error('Product not found in cart');
		}
		return await CartModel.findById(cartId);
	}
}

export default new CartMongoDAO();
