import {ProductManager} from '../managers/product-manager.js';
import {Server} from 'socket.io';
import express from 'express';

export const routerProducts = express.Router();

const manager = new ProductManager('./src/db/products.json');
await manager.initialize();

const io = new Server();

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

	// Emitir evento de producto creado a través del websocket
	io.emit('productCreated', newProduct);

	res.send(newProduct);
});

routerProducts.put('/:pid', async (req, res) => {
	const pid = req.params.pid;
	const updatedFields = req.body;
	const updatedProduct = await manager.updateProduct(pid, updatedFields);
	if (updatedProduct) {
		// Emitir evento de producto actualizado a través del websocket
		io.emit('productUpdated', updatedProduct);
		res.send(updatedProduct);
	} else {
		res.status(404).send({error: 'Product not found'});
	}
});

routerProducts.delete('/:pid', async (req, res) => {
	const pid = req.params.pid;
	const deletedProduct = await manager.deleteProduct(pid);
	if (deletedProduct) {
		// Emitir evento de producto eliminado a través del websocket
		io.emit('productDeleted', deletedProduct);
		res.send({message: `Product with id ${pid} deleted successfully`});
	} else {
		res.status(404).send({error: 'Product not found'});
	}
});

export default {routerProducts, io};
