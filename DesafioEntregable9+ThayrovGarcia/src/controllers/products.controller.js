import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';
import {initializeProductService} from '../services/products.service.js';

class ProductsController {
	constructor() {
		this.productService = initializeProductService();
	}
	async getAllProducts(req, res) {
		try {
			const {limit = 5, ...query} = req.query;

			const products = await this.productService.getAllProducts({
				limit,
				...query,
			});

			res.status(200).send({
				status: 'Success',
				payload: products.docs.map(product => ({
					id: product._id.toString(),
					name: product.name,
					description: product.description,
					price: product.price,
					stock: product.stock,
					thumbnails: product.thumbnails,
					code: product.code,
				})),
				totalPages: products.totalPages,
				prevPage: products.prevPage,
				nextPage: products.nextPage,
				page: products.page,
				hasPrevPage: products.hasPrevPage,
				hasNextPage: products.hasNextPage,
				prevLink: products.hasPrevPage
					? `/api/products?limit=${limit}&page=${products.prevPage}`
					: null,
				nextLink: products.hasNextPage
					? `/api/products?limit=${limit}&page=${products.nextPage}`
					: null,
			});
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'GetAllProductsError',
					cause: err,
					message: 'Error retrieving all products',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
	}

	async getViewAllProducts(req, res) {
		try {
			const {limit = 5, ...query} = req.query;

			const products = await this.productService.getAllProducts({
				limit,
				...query,
			});

			res.render('products', {
				status: 'Success',
				payload: products.docs.map(product => ({
					id: product._id.toString(),
					title: product.title,
					description: product.description,
					price: product.price,
					stock: product.stock,
					thumbnails: product.thumbnails,
					code: product.code,
				})),
				totalPages: products.totalPages,
				prevPage: products.prevPage,
				nextPage: products.nextPage,
				page: products.page,
				hasPrevPage: products.hasPrevPage,
				hasNextPage: products.hasNextPage,
				prevLink: products.hasPrevPage
					? `/view/products?limit=${limit}&page=${products.prevPage}`
					: null,
				nextLink: products.hasNextPage
					? `/view/products?limit=${limit}&page=${products.nextPage}`
					: null,
			});
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'ViewAllProductsError',
					cause: err,
					message: 'Error viewing all products',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
	}

	async getProductById(req, res) {
		try {
			const id = req.params.pid;
			const product = await this.productService.getProductById(id);
			if (product) {
				res.send({product});
			} else {
				res.status(404).send({error: 'Product not found'});
			}
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'GetProductByIdError',
					cause: err,
					message: 'Error retrieving product by ID',
					code: EErrors.PRODUCT_NOT_FOUND,
				}),
			);
		}
	}

	async getViewProductById(req, res) {
		try {
			const id = req.params.pid;
			const product = await this.productService.getProductById(id);
			if (product) {
				res.render('product', {product});
			} else {
				res.status(404).send({error: 'Product not found'});
			}
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'ViewProductByIdError',
					cause: err,
					message: 'Error viewing product by ID',
					code: EErrors.PRODUCT_NOT_FOUND,
				}),
			);
		}
	}

	async createProduct(req, res) {
		try {
			const productData = req.body;
			const newProduct = await this.productService.createProduct(productData);
			res.send(newProduct);
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'CreateProductError',
					cause: err,
					message: 'Error creating product',
					code: EErrors.PRODUCT_VALIDATION_ERROR,
				}),
			);
		}
	}

	async updateProduct(req, res) {
		try {
			const id = req.params.pid;
			const updatedFields = req.body;
			const updatedProduct = await this.productService.updateProduct(
				id,
				updatedFields,
			);
			if (updatedProduct) {
				res.send(updatedProduct);
			} else {
				res.status(404).send({error: 'Product not found'});
			}
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'UpdateProductError',
					cause: err,
					message: 'Error updating product',
					code: EErrors.PRODUCT_VALIDATION_ERROR,
				}),
			);
		}
	}

	async deleteProduct(req, res) {
		try {
			const id = req.params.pid;
			const deletedProduct = await this.productService.deleteProduct(id);
			if (deletedProduct) {
				res.send({message: `Product with id ${id} deleted successfully`});
			} else {
				res.status(404).send({error: 'Product not found'});
			}
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'DeleteProductError',
					cause: err,
					message: 'Error deleting product',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
	}
}

export default new ProductsController();
