import {DAOFactory} from '../dao/factory.js';
import {logger} from '../config/logger.config.js';

export class ProductService {
	async init() {
		this.productDAO = await DAOFactory('products');
	}

	validateCreateProduct(productData) {
		const {title, description, code, price, stock, thumbnail} = productData;
		if (!title || !description || !code || !price || !stock || !thumbnail) {
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

	async createProduct(productData) {
		this.validateCreateProduct(productData);

		return await this.productDAO.create(productData);
	}

	async updateProduct(id, updatedFields) {
		this.validateUpdateProduct(id, updatedFields);

		return await this.productDAO.update(id, updatedFields);
	}

	async deleteProduct(id) {
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
