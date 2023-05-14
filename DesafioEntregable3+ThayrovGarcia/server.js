import {ProductManager} from './product-manager.js';
import express from 'express';

const app = express();
const port = 8080;

const manager = new ProductManager();
await manager.initialize();

app.get('/products', async (req, res) => {
	const limit = req.query.limit;
	const products = await manager.getProducts();
	const result = limit ? products.slice(0, limit) : products;
	res.send(result);
});

app.get('/products/:pid', async (req, res) => {
	const pid = req.params.pid;
	const product = await manager.getProductById(pid);
	if (product) {
		res.send(product);
	} else {
		res.status(404).send({error: 'Product not found'});
	}
});

app.get('*', async (req, res) => {
	res.status(404).send({error: 'Page not found'});
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
