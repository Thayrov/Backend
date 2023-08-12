import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';
import {initializeMockService} from '../services/mock.service.js';

class MockController {
	async createAllMockProducts(req, res, next) {
		const mockService = await initializeMockService();
		try {
			const mockProducts = mockService.generateMockProducts();
			res.json(mockProducts);
		} catch (err) {
			return next(
				CustomError.createError({
					name: 'CreateMockProductsError',
					cause: err,
					message: 'Error creating mock products',
					code: EErrors.DATABASE_ERROR,
				}),
			);
		}
	}
}

export default new MockController();
