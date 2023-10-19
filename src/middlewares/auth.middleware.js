import {logger} from '../config/logger.config.js';

export const isAuthenticated = (req, res, next) => {
  logger.info('isAuthenticated middleware triggered');
  res.locals.userIsLoggedIn = req.isAuthenticated();

  if (req.isAuthenticated()) {
    logger.info('next() called without argument');

    return next();
  }

  if (!req.isAuthenticated()) {
    logger.warn('User is not authenticated');
    return res.status(401).send('Unauthorized');
  }
};

export const isAdmin = (req, res, next) => {
  res.locals.userIsAdmin = req.isAdmin();
  isAuthenticated(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      logger.info('next() called without argument');

      return next();
    } else {
      logger.warn('Access attempt by non-admin user');
      return res.status(403).send('Access denied. Only admins can perform this action.');
    }
  });
};

export const isUser = (req, res, next) => {
  isAuthenticated(req, res, () => {
    if (req.user && (req.user.role === 'user' || req.user.role === 'premium')) {
      logger.info('next() called without argument');

      return next();
    } else {
      logger.warn('Access attempt by non-user entity');
      return res.status(403).send('Access denied. Only users can perform this action.');
    }
  });
};
