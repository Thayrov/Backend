import ProductModel from './models/products.model.js';
import {logger} from '../../config/logger.config.js';
import mongoose from 'mongoose';

class ProductMongoDAO {
	// Utility function to convert id to mongoose ObjectId type
	getObjectId(id) {
		try {
			return id instanceof mongoose.Types.ObjectId
				? id
				: new mongoose.Types.ObjectId(id);
		} catch (error) {
			logger.error(`Error in converting to ObjectId: ${error.message}`);
			throw new Error('Invalid ObjectId');
		}
	}

	async create(product) {
		return await ProductModel.create(product);
	}

	async findAll() {
		return await ProductModel.find();
	}

	async findById(id) {
		const objectId = this.getObjectId(id);
		try {
			logger.debug(`Attempting to find product with ID: ${objectId}`);
			const product = await ProductModel.findById(objectId);
			if (product) {
				logger.info(`Product found: ${product._id}`);
			} else {
				logger.warn(`Product with ID: ${objectId} not found`);
			}
			return product;
		} catch (error) {
			logger.error(`Error in findById: ${error.message}`);
			throw error;
		}
	}

	async findByCode(code) {
		return await ProductModel.findOne({code});
	}

	async update(id, product) {
		const objectId = this.getObjectId(id);
		const updatedProduct = await ProductModel.findByIdAndUpdate(
			objectId,
			product,
			{new: true},
		);
		return updatedProduct;
	}

	async delete(id) {
		const objectId = this.getObjectId(id);
		const deletedProduct = await ProductModel.findByIdAndDelete(objectId);
		return deletedProduct;
	}
}

export default new ProductMongoDAO();
