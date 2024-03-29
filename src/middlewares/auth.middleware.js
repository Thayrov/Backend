import {logger} from '../config/logger.config.js';

export const isAuthenticated = (req, res, next) => {
  res.locals.userIsLoggedIn = req.isAuthenticated();
  req.isAdmin = function () {
    return this.user && this.user.role === 'admin';
  };
  res.locals.userIsAdmin = req.isAdmin();
  if (req.isAuthenticated()) {
    return next();
  }

  if (!req.isAuthenticated()) {
    logger.warn('User is not authenticated');
    return res.status(401).send('Unauthorized');
  }
};

export const isAdmin = (req, res, next) => {
  req.isAdmin = function () {
    return this.user && this.user.role === 'admin';
  };

  isAuthenticated(req, res, () => {
    if (req.isAdmin()) {
      res.locals.userIsAdmin = true;
      return next();
    } else {
      logger.warn('Access attempt by non-admin user');
      res.locals.userIsAdmin = false;
      return res.status(403).send('Access denied. Only admins can perform this action.');
    }
  });
};

export const isUser = (req, res, next) => {
  isAuthenticated(req, res, () => {
    if (req.user && (req.user.role === 'user' || req.user.role === 'premium')) {
      return next();
    } else {
      logger.warn('Access attempt by non-user entity');
      return res.status(403).send('Access denied. Only users can perform this action.');
    }
  });
};
