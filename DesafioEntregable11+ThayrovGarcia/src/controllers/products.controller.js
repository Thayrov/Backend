import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';
import {initializeProductService} from '../services/products.service.js';
import {logger} from '../config/logger.config.js';

class ProductsController {
	init = async () => {
		this.productService = await initializeProductService();
	};
	getAllProducts = async (req, res, next) => {
		try {
			const {limit = 5, ...query} = req.query;

			const products = await this.productService.getAllProducts({
				limit,
				...query,
			});

			res.status(200).send({
				status: 'Success',
				payload: products.map(product => ({
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
			logger.error('Error retrieving all products: ' + err.message);

			return next(
				CustomError.createError({
					name: 'GetAllProductsError',
					cause: err,
					message: 'Error retrieving all products',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
	};

	getViewAllProducts = async (req, res, next) => {
		try {
			const {limit = 5, ...query} = req.query;

			const products = await this.productService.getAllProducts({
				limit,
				...query,
			});

			res.render('products', {
				status: 'Success',
				payload: products.map(product => ({
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
			logger.error('Error viewing all products: ' + err.message);
			return next(
				CustomError.createError({
					name: 'ViewAllProductsError',
					cause: err,
					message: 'Error viewing all products',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
	};

	getProductById = async (req, res, next) => {
		try {
			const id = req.params.pid;
			const product = await this.productService.getProductById(id);
			if (product) {
				res.send({product});
			} else {
				res.status(404).send({error: 'Product not found'});
			}
		} catch (err) {
			logger.error('Error retrieving product by ID: ' + err.message);
			return next(
				CustomError.createError({
					name: 'GetProductByIdError',
					cause: err,
					message: 'Error retrieving product by ID',
					code: EErrors.PRODUCT_NOT_FOUND,
				}),
			);
		}
	};

	getViewProductById = async (req, res, next) => {
		try {
			const id = req.params.pid;
			const product = await this.productService.getProductById(id);
			if (product) {
				res.render('product', {product});
			} else {
				res.status(404).send({error: 'Product not found'});
			}
		} catch (err) {
			logger.error('Error viewing product by ID: ' + err.message);
			return next(
				CustomError.createError({
					name: 'ViewProductByIdError',
					cause: err,
					message: 'Error viewing product by ID',
					code: EErrors.PRODUCT_NOT_FOUND,
				}),
			);
		}
	};

	createProduct = async (req, res, next) => {
		try {
			const productData = req.body;
			const newProduct = await this.productService.createProduct(productData);
			res.send(newProduct);
		} catch (err) {
			logger.error('Error creating product: ' + err.message);
			return next(
				CustomError.createError({
					name: 'CreateProductError',
					cause: err,
					message: 'Error creating product',
					code: EErrors.PRODUCT_VALIDATION_ERROR,
				}),
			);
		}
	};

	updateProduct = async (req, res, next) => {
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
			logger.error('Error updating product: ' + err.message);
			return next(
				CustomError.createError({
					name: 'UpdateProductError',
					cause: err,
					message: 'Error updating product',
					code: EErrors.PRODUCT_VALIDATION_ERROR,
				}),
			);
		}
	};

	deleteProduct = async (req, res, next) => {
		try {
			const id = req.params.pid;
			const deletedProduct = await this.productService.deleteProduct(id);
			if (deletedProduct) {
				res.send({message: `Product with id ${id} deleted successfully`});
			} else {
				res.status(404).send({error: 'Product not found'});
			}
		} catch (err) {
			logger.error('Error deleting product: ' + err.message);
			return next(
				CustomError.createError({
					name: 'DeleteProductError',
					cause: err,
					message: 'Error deleting product',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
	};
}

let productsController;

export const initializeProductsController = async () => {
	if (!productsController) {
		productsController = new ProductsController();
		await productsController.init();
	}
	return productsController;
};
