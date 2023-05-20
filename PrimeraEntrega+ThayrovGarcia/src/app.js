import express from 'express';
import {routerCarts} from './routes/carts.routes.js';
import {routerProducts} from './routes/products.routes.js';

const app = express();
const port = 8080;

app.use(express.static('src/public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.get('*', async (req, res) => {
	res.status(404).send({error: 'Page not found'});
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
