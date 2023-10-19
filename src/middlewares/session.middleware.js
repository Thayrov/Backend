import {initializeCartService} from '../services/carts.service.js';

export const ensureCart = async (req, res, next) => {
	try {
		if (!req.session || !req.session.cartId) {
			const cartServiceInstance = await initializeCartService();
			const newCart = await cartServiceInstance.createCart({});
			if (req.session) {
				req.session.cartId = newCart._id;
			}
			console.log(
				'Session Cart ID in middleware:',
				req.session ? req.session.cartId : 'Session not initialized',
			);
		}
		res.locals.cartId = req.session.cartId;
		next();
	} catch (error) {
		console.error('Error in ensureCart:', error);
		next(error);
	}
};
