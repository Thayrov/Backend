import {initializeCartService} from '../services/carts.service.js';

export const ensureCart = async (req, res, next) => {
	if (!req.session.cartId) {
		const cartServiceInstance = await initializeCartService();
		const newCart = await cartServiceInstance.createCart({});
		req.session.cartId = newCart._id;
		console.log('Session Cart ID in middleware:', req.session.cartId);
	}
	next();
};
