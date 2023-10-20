import {initializeCartService} from '../services/carts.service.js';
import {logger} from '../config/logger.config.js';

export const ensureCart = async (req, res, next) => {
  try {
    if (!req.session || !req.session.cartId) {
      const cartServiceInstance = await initializeCartService();
      const newCart = await cartServiceInstance.createCart({});
      if (req.session) {
        req.session.cartId = newCart._id;
      }
      logger.info(
        'Session Cart ID in middleware:',
        req.session ? req.session.cartId : 'Session not initialized',
      );
    }
    res.locals.cartId = req.session.cartId;
    next();
  } catch (error) {
    logger.error('Error in ensureCart:', error);
    next(error);
  }
};

export const productAdded = (req, res, next) => {
  res.locals.productAdded = req.cookies.productAdded || false;
  next();
};
