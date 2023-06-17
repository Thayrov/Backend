import ProductModel from '../dao/models/products.model.js';
import mongoosePaginate from 'mongoose-paginate-v2';

/* mongoosePaginate.paginate.options = {
	limit: 10,
	lean: true,
	leanWithId: false,
}; */

export class ProductService {
	/* 	async getAllProducts(options) {
		try {
			const result = await ProductModel.paginate({}, options);
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	} */

	async getAllProducts({limit = 10, page, sort, query}) {
		try {
			const products = await ProductModel.paginate(
				{},
				{page: page || 1, limit: limit || 10, sort: sort},
			);
			return products;
		} catch (error) {
			throw error;
		}
	}
	/* 	async getAllProducts() {
		try {
			const products = await ProductModel.find();
			return products;
		} catch (error) {
			throw error;
		}
	} */
	async getProductById(id) {
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
		try {
			const newProduct = await ProductModel.create(productData);
			return newProduct;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async updateProduct(id, updatedFields) {
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

// export default ProductService;
