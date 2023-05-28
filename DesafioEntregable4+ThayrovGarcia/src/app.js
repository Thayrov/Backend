import {createServer} from 'http';
import {dirname} from 'path';
import express from 'express';
import {fileURLToPath} from 'url';
import handlebars from 'express-handlebars';
import productsRoutes from './routes/products.routes.js';
import {routerCarts} from './routes/carts.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

app.use(express.static('src/public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configurar el motor de plantillas Handlebars
app.engine(
	'handlebars',
	handlebars.create({
		layoutsDir: `${__dirname}/views/layouts`,
		partialsDir: `${__dirname}/views/partials`,
		defaultLayout: 'main',
		extname: 'handlebars',
	}).engine,
);

app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use('/api/products', productsRoutes.routerProducts);
app.use('/api/carts', routerCarts);

app.get('*', async (req, res) => {
	res.status(404).send({error: 'Page not found'});
});

const server = createServer(app);
productsRoutes.io.attach(server);

productsRoutes.io.on('connection', socket => {
	console.log('Client connected');
});

server.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
