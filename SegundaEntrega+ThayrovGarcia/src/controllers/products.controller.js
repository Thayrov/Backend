import {ProductService} from '../services/products.service.js';
import mongoose from 'mongoose';

const productService = new ProductService();

/* export const getAllProducts = async (req, res) => {
	try {
		const products = await productService.getAllProducts();

		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
}; */

export const getAllProducts = async (req, res) => {
	try {
		const products = await productService.getAllProducts(req.query);

		res.status(200).send({
			payload: products.docs.map(product => ({
				id: product._id.toString(),
				name: product.name,
				description: product.description,
				price: product.price,
				stock: product.stock,
				thumbnails: product.thumbnails,
				status: product.status,
				code: product.code,
				category: product.category,
			})),
			totalPages: products.totalPages,
			prevPage: products.prevPage,
			nextPage: products.nextPage,
			page: products.page,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
};

/* export const getAllProducts = async (req, res) => {
	const {limit = 10, page = 1, sort, query} = req.query;

	const options = {
		limit: parseInt(limit),
		page: parseInt(page),
		sort: sort === 'asc' || sort === 'desc' ? {price: sort} : null,
		customLabels: {
			totalDocs: 'totalProducts',
			docs: 'products',
		},
	};

	const queryObj = query
		? {$or: [{category: query}, {availability: query}]}
		: {};

	try {
		const products = await productService.getAllProducts(options);

		res.json({
			products: products.docs,
			totalPages: products.totalPages,
			prevPage: products.prevPage || null,
			nextPage: products.nextPage || null,
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
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
}; */

/* export const getAllProducts = async (req, res) => {
	const {limit = 10, page = 1, sort, query} = req.query;

	const options = {
		limit: parseInt(limit),
		page: parseInt(page),
		sort: sort === 'asc' || sort === 'desc' ? {price: sort} : null,
		customLabels: {
			totalDocs: 'totalProducts',
			docs: 'products',
		},
	};

	const queryObj = query
		? {$or: [{category: query}, {availability: query}]}
		: {};

	try {
		const products = await productService.getAllProducts(options);

		res.render('products', {
			products: products.docs,
			totalPages: products.totalPages,
			prevPage: products.prevPage || null,
			nextPage: products.nextPage || null,
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
	} catch (error) {
		console.error(error);
		res.status(500).send({error: 'Internal server error'});
	}
}; */

export const getProductById = async (req, res) => {
	try {
		const id = new mongoose.Types.ObjectId(req.params.pid);
		const product = await productService.getProductById(id);
		if (product) {
			// res.json(product);
			res.render('product', {product});
		} else {
			res.status(404).send({error: 'Product not found'});
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({error: 'Internal server error'});
	}
};

export const createProduct = async (req, res) => {
	try {
		const productData = req.body;
		const newProduct = await productService.createProduct(productData);
		res.send(newProduct);
	} catch (error) {
		console.error(error);
		res.status(500).send({error: 'Internal server error'});
	}
};

export const updateProduct = async (req, res) => {
	try {
		const id = req.params.pid;
		const updatedFields = req.body;
		const updatedProduct = await productService.updateProduct(
			id,
			updatedFields,
		);
		if (updatedProduct) {
			res.send(updatedProduct);
		} else {
			res.status(404).send({error: 'Product not found'});
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({error: 'Internal server error'});
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const id = req.params.pid;
		const deletedProduct = await productService.deleteProduct(id);
		if (deletedProduct) {
			res.send({message: `Product with id ${id} deleted successfully`});
		} else {
			res.status(404).send({error: 'Product not found'});
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({error: 'Internal server error'});
	}
};
