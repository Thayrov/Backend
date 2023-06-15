import * as productService from '../services/products.service.js';

export const getAllProducts = async (req, res) => {
	const limit = req.query.limit;
	const products = await productService.getAllProducts(limit);
	res.send(products);
};

export const getProductById = async (req, res) => {
	const id = req.params.pid;
	const product = await productService.getProductById(id);
	if (product) {
		res.send(product);
	} else {
		res.status(404).send({error: 'Product not found'});
	}
};

export const createProduct = async (req, res) => {
	const productData = req.body;
	const newProduct = await productService.createProduct(productData);
	res.send(newProduct);
};

export const updateProduct = async (req, res) => {
	const id = req.params.pid;
	const updatedFields = req.body;
	const updatedProduct = await productService.updateProduct(id, updatedFields);
	if (updatedProduct) {
		res.send(updatedProduct);
	} else {
		res.status(404).send({error: 'Product not found'});
	}
};

export const deleteProduct = async (req, res) => {
	const id = req.params.pid;
	const deletedProduct = await productService.deleteProduct(id);
	if (deletedProduct) {
		res.send({message: `Product with id ${id} deleted successfully`});
	} else {
		res.status(404).send({error: 'Product not found'});
	}
};
