import {ProductManager} from '../managers/product-manager.js';
import express from 'express';

export const routerProducts = express.Router();

const manager = new ProductManager();
await manager.initialize();

routerProducts.get('/', async (req, res) => {
	const limit = req.query.limit;
	const products = await manager.getProducts();
	const result = limit ? products.slice(0, limit) : products;
	res.send(result);
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
