import {ProductManager} from '../managers/product-manager.js';
import {Server} from 'socket.io';
import express from 'express';

const routerProducts = express.Router();
const manager = new ProductManager('./src/db/products.json');
await manager.initialize();

const io = new Server();
routerProducts.io = io;

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

	if (newProduct && routerProducts.io) {
		routerProducts.io.emit('productCreated', newProduct);
	}

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
		if (routerProducts.io) {
			routerProducts.io.emit('productDeleted', pid);
		}
		res.send({message: `Product with id ${pid} deleted successfully`});
	} else {
		res.status(404).send({error: 'Product not found'});
	}
});

routerProducts.get('/realtimeproducts', async (req, res) => {
	const products = await manager.getProducts();
	res.render('realTimeProducts', {products});
});

export {routerProducts};
