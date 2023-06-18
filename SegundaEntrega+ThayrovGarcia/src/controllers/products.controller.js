import {ProductService} from '../services/products.service.js';

const productService = new ProductService();

export const getAllProducts = async (req, res) => {
	try {
		const {limit = 5, ...query} = req.query;

		const products = await productService.getAllProducts({limit, ...query});

		res.status(200).send({
			status: 'Success',
			payload: products.docs.map(product => ({
				id: product._id.toString(),
				name: product.name,
				description: product.description,
				price: product.price,
				stock: product.stock,
				thumbnails: product.thumbnails,
				// status: product.status,
				code: product.code,
				// category: product.category,
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
	} catch (error) {
		console.error(error);
		res.status(500).json({status: 'Internal server error'});
	}
};

export const getViewAllProducts = async (req, res) => {
	try {
		const {limit = 5, ...query} = req.query;

		const products = await productService.getAllProducts({limit, ...query});

		res.render('products', {
			status: 'Success',
			payload: products.docs.map(product => ({
				id: product._id.toString(),
				title: product.title,
				description: product.description,
				price: product.price,
				stock: product.stock,
				thumbnails: product.thumbnails,
				// status: product.status,
				code: product.code,
				// category: product.category,
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
	} catch (error) {
		console.error(error);
		res.status(500).json({status: 'Internal server error'});
	}
};

export const getProductById = async (req, res) => {
	try {
		const id = req.params.pid;
		const product = await productService.getProductById(id);
		if (product) {
			// res.send({product});
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
