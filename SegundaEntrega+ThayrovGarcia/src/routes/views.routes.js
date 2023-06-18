import express from 'express';
import {getAllProducts} from '../controllers/products.controller.js';

const viewsRouter = express.Router();

viewsRouter.get('/', getAllProducts);

export default viewsRouter;
