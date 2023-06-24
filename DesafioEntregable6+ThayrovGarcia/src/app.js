import db from './dao/db.js';
import express from 'express';
import {fileURLToPath} from 'url';
import handlebars from 'express-handlebars';
import path from 'path';
import routerCarts from './routes/carts.routes.js';
import routerProducts from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/view/products', viewsRouter);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.get('*', (req, res) => {
	return res.status(404).json({
		status: 'error',
		msg: 'Page not found',
		data: {},
	});
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

