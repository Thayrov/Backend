import MockController from '../controllers/mock.controller.js';
import express from 'express';

const mockRouter = express.Router();
const {createAllMockProducts} = MockController;
mockRouter.get('/', createAllMockProducts);

export default mockRouter;
