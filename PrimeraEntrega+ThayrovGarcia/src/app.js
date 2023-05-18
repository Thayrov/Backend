import express from 'express';
import {routerProducts} from './routes/products.routes.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/products', routerProducts);

app.get('*', async (req, res) => {
	res.status(404).send({error: 'Page not found'});
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
