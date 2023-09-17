import {DAOFactory} from '../dao/factory.js';
import {logger} from '../config/logger.config.js';
import mongoose from 'mongoose';

export class ProductService {
	async init() {
		this.productDAO = await DAOFactory('products');
		if (!this.productDAO) {
			throw new Error('Failed to initialize productDAO');
		}
	}
	validateCreateProduct(productData) {
		const {title, description, code, price, stock} = productData;
		if (!title || !description || !code || !price || !stock) {
			logger.error('validation error: Please complete all fields.');
			throw 'Validation Error';
		}
	}

	validateUpdateProduct(id, updatedFields) {
		const {title, description, code, price, stock, thumbnail} = updatedFields;
		if (
			!id ||
			!title ||
			!description ||
			!code ||
			!price ||
			!stock ||
			!thumbnail
		) {
			logger.error('validation error: please complete required data.');
			throw 'Validation Error';
		}
	}

	validateId(id) {
		if (!id) {
			logger.error('validation error: ID not available.');
			throw 'Validation Error';
		}
	}

	async getAllProducts({limit = 5, page = 1, sort, query}) {
		return await this.productDAO.findAll({limit, page, sort, query});
	}

	async getProductById(id) {
		this.validateId(id);

		return await this.productDAO.findById(id);
	}

	async getProductByCode(code) {
		return await this.productDAO.findByCode(code);
	}

	async createProduct(productData, user) {
		this.validateCreateProduct(productData);

		// Set default owner to 'admin' if not provided
		if (!productData.owner) {
			productData.owner = new mongoose.Types.ObjectId(
				'65066e45682d9b489464161b',
			); // 'admin';
		} else {
			// Validate if the user is premium before setting them as owner
			if (user.role === 'premium') {
				productData.owner = user._id;
			} else {
				throw new Error('Only premium users can set themselves as owner');
			}
		}

		return await this.productDAO.create(productData);
	}

	async updateProduct(id, updatedFields, user) {
		console.log('Debug: Inside updateProduct. ID:', id);

		const existingProduct = await this.productDAO.findById(id);
		if (!existingProduct) {
			throw new Error('Product not found');
		}

		if (
			existingProduct.owner &&
			existingProduct.owner !== user._id &&
			user.role !== 'admin'
		) {
			throw new Error('You are not authorized to update this product');
		}

		this.validateUpdateProduct(id, updatedFields);

		// Validate if the user is premium if they are trying to set/change the owner
		if (updatedFields.owner) {
			if (user.role !== 'premium') {
				throw new Error('Only premium users can set/change the owner');
			}
		}

		return await this.productDAO.update(id, updatedFields);
	}

	async deleteProduct(id, user) {
		console.log('Debug: Inside deleteProduct. ID:', id);

		const existingProduct = await this.productDAO.findById(id);
		if (!existingProduct) {
			throw new Error('Product not found');
		}

		if (
			existingProduct.owner &&
			existingProduct.owner !== user._id &&
			user.role !== 'admin'
		) {
			throw new Error('You are not authorized to delete this product');
		}

		return await this.productDAO.delete(id);
	}
}

let productService;

export const initializeProductService = async () => {
	if (!productService) {
		productService = new ProductService();
		await productService.init();
	}
	return productService;
};
