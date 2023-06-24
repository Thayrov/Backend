import ProductModel from '../dao/models/products.model.js';
import mongoosePaginate from 'mongoose-paginate-v2';

export class ProductService {
	validateCreateProduct(productData) {
		const {
			title,
			description,
			code,
			price,
			stock,
			thumbnail,
		} = // , category
			productData;
		if (
			!title ||
			!description ||
			!code ||
			!price ||
			!stock ||
			// !category ||
			!thumbnail
		) {
			console.log('validation error: Please complete all fields.');
			throw 'Validation Error';
		}
	}
	validateUpdateProduct(id, updatedFields) {
		const {
			title,
			description,
			code,
			price,
			stock,
			thumbnail,
		} = // , category
			updatedFields;
		if (
			!id ||
			!title ||
			!description ||
			!code ||
			!price ||
			!stock ||
			// !category ||
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
			const options = {
				page: parseInt(page),
				limit: parseInt(limit),
				sort: sort ? {price: sort} : undefined,
			};

			const queryObj = query
				? {$or: [{category: query}, {availability: query}]}
				: {};

			const products = await ProductModel.paginate(queryObj, options);
			return products;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getProductById(id) {
		this.validateId(id);
		try {
			const product = await ProductModel.findById(id);
			return product;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getProductByCode(code) {
		try {
			const product = await ProductModel.findOne({code});
			return product;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async createProduct(productData) {
		this.validateCreateProduct(productData);
		try {
			const newProduct = await ProductModel.create(productData);
			return newProduct;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async updateProduct(id, updatedFields) {
		this.validateUpdateProduct(id, updatedFields);
		try {
			const updatedProduct = await ProductModel.findByIdAndUpdate(
				id,
				updatedFields,
				{new: true},
			);
			return updatedProduct;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async deleteProduct(id) {
		try {
			const deletedProduct = await ProductModel.findByIdAndDelete(id);
			return deletedProduct;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
