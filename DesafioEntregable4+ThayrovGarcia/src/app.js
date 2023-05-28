import {Server} from 'socket.io';
import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http';
import {routerCarts} from './routes/carts.routes.js';
import {routerProducts} from './routes/products.routes.js';

const app = express();
const port = 8080;

app.use(express.static('src/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine(
	'handlebars',
	handlebars.engine({
		defaultLayout: 'main',
		layoutsDir: 'src/views/layouts',
	}),
);
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

const server = http.createServer(app);

const io = new Server(server);

io.on('connection', socket => {
	console.log('Cliente conectado');

	socket.on('createProduct', product => {
		io.emit('productCreated', product);
	});

	socket.on('deleteProduct', productId => {
		io.emit('productDeleted', productId);
	});
});

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.get('/', (req, res) => {
	const products = manager.getProducts();

	res.render('home', {products});
});

app.get('/realtimeproducts', (req, res) => {
	const products = manager.getProducts();

	res.render('realTimeProducts', {products});
});

app.get('*', (req, res) => {
	res.status(404).send({error: 'Page not found'});
});

server.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
