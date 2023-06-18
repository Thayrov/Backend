import express from 'express';
import {getViewAllProducts} from '../controllers/products.controller.js';

const viewsRouter = express.Router();

viewsRouter.get('/', getViewAllProducts);

export default viewsRouter;
