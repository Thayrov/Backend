import ProductModel from './models/products.model.js';
import {logger} from '../../config/logger.config.js';
import mongoose from 'mongoose';

class ProductMongoDAO {
	async create(product) {
		return await ProductModel.create(product);
	}

	async findAll() {
		return await ProductModel.find();
	}
	async findById(id) {
		try {
			// Validate and convert the ID to an ObjectId instance
			const objectId =
				id instanceof mongoose.Types.ObjectId
					? id
					: new mongoose.Types.ObjectId(id);

			// Log the operation
			logger.debug(`Attempting to find product with ID: ${objectId}`);

			// Perform the database query
			const product = await ProductModel.findById(objectId);

			// Log the result
			if (product) {
				logger.info(`Product found: ${product._id}`);
			} else {
				logger.warn(`Product with ID: ${objectId} not found`);
			}

			return product;
		} catch (error) {
			// Log the error
			logger.error(`Error in findById: ${error.message}`);

			// Re-throw the error for higher-level handling
			throw error;
		}
	}

	async findByCode(code) {
		return await ProductModel.findOne({code});
	}

	async update(id, product) {
		console.log('Debug: Inside DAO update. ID:', id);
		return await ProductModel.findByIdAndUpdate(id, product, {new: true});
	}

	async delete(id) {
		console.log('Debug: Inside DAO delete. ID:', id);
		return await ProductModel.findByIdAndDelete(id);
	}
}

export default new ProductMongoDAO();
