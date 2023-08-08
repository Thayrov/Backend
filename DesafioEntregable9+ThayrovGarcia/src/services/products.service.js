import {DAOFactory} from '../dao/factory.js';

export class ProductService {
	constructor() {
		this.productDAO = DAOFactory('products');
	}

	validateCreateProduct(productData) {
		const {title, description, code, price, stock, thumbnail} = productData;
		if (!title || !description || !code || !price || !stock || !thumbnail) {
			console.log('validation error: Please complete all fields.');
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
			console.log('validation error: please complete required data.');
			throw 'Validation Error';
		}
	}

	validateId(id) {
		if (!id) {
			console.log('validation error: ID not available.');
			throw 'Validation Error';
		}
	}

	async getAllProducts({limit = 5, page = 1, sort, query}) {
		try {
			return await this.productDAO.findAll({limit, page, sort, query});
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getProductById(id) {
		this.validateId(id);
		try {
			return await this.productDAO.findById(id);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getProductByCode(code) {
		try {
			return await this.productDAO.findByCode(code);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async createProduct(productData) {
		this.validateCreateProduct(productData);
		try {
			return await this.productDAO.create(productData);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async updateProduct(id, updatedFields) {
		this.validateUpdateProduct(id, updatedFields);
		try {
			return await this.productDAO.update(id, updatedFields);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async deleteProduct(id) {
		try {
			return await this.productDAO.delete(id);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

export default new ProductService();
