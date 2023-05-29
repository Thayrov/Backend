import {Server} from 'socket.io';
import {createServer} from 'http';
import express from 'express';
import handlebars from 'express-handlebars';
import {routerProducts} from './routes/products.routes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 8080;

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products', routerProducts);

io.on('connection', socket => {
	console.log('Cliente conectado');
	socket.emit('update-products', products);

	socket.on('new-product', async productData => {
		const newProduct = await manager.addProduct(productData);
		products.push(newProduct);
		io.emit('update-products', products);
	});

	socket.on('delete-product', async productId => {
		const deletedProduct = await manager.deleteProduct(productId);
		products = products.filter(product => product.id !== productId);
		io.emit('update-products', products);
	});
});

app.get('/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {layout: 'main'});
});

app.get('*', async (req, res) => {
	res.status(404).send({error: 'Page not found'});
});

httpServer.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
