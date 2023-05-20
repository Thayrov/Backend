import {ProductManager} from '../managers/product-manager.js';
import express from 'express';

export const routerProducts = express.Router();

const manager = new ProductManager();

routerProducts.get('/', async (req, res) => {
	const limit = req.query.limit;
	const products = await manager.getProducts(limit);
	res.send(products);
});

routerProducts.get('/:pid', async (req, res) => {
	const pid = req.params.pid;
	const product = await manager.getProductById(pid);
	if (product) {
		res.send(product);
	} else {
		res.status(404).send({error: 'Product not found'});
	}
});

routerProducts.post('/', async (req, res) => {
	const productData = req.body;
	const newProduct = await manager.addProduct(productData);
	res.send(newProduct);
});

routerProducts.put('/:pid', async (req, res) => {
	const pid = req.params.pid;
	const updatedFields = req.body;
	const updatedProduct = await manager.updateProduct(pid, updatedFields);
	if (updatedProduct) {
		res.send(updatedProduct);
	} else {
		res.status(404).send({error: 'Product not found'});
	}
});

routerProducts.delete('/:pid', async (req, res) => {
	const pid = req.params.pid;
	const deletedProduct = await manager.deleteProduct(pid);
	if (deletedProduct) {
		res.send({message: `Product with id ${pid} deleted successfully`});
	} else {
		res.status(404).send({error: 'Product not found'});
	}
});
