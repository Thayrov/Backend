import {
	getViewAllProducts,
	getViewProductById,
} from '../controllers/products.controller.js';

import express from 'express';

const viewsRouter = express.Router();

viewsRouter.get('/', getViewAllProducts);
viewsRouter.get('/:pid', getViewProductById);

export default viewsRouter;
