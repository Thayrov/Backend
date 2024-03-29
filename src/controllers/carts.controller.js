import CustomError from '../services/errors/custom-error.js';
import EErrors from '../services/errors/enums.js';
import {initializeCartService} from '../services/carts.service.js';
import {logger} from '../config/logger.config.js';

class CartsController {
  init = async () => {
    this.cartService = await initializeCartService();
  };
  createCart = async (req, res, next) => {
    try {
      const cartData = req.body;
      const newCart = await this.cartService.createCart(cartData);
      res.status(201).json(newCart);
    } catch (err) {
      logger.error('Error creating cart: ' + err.message);
      return next(
        CustomError.createError({
          name: 'CreateCartError',
          cause: err,
          message: 'Error creating cart',
          code: EErrors.CART_VALIDATION_ERROR,
        }),
      );
    }
  };

  getCartById = async (req, res, next) => {
    try {
      const cartId = req.params.cid;
      const cart = await this.cartService.getCartById(cartId);
      if (cart) {
        res.json(cart);
      } else {
        logger.warn('Cart not found with ID: ' + cartId);
        return next(
          CustomError.createError({
            name: 'CartNotFoundError',
            cause: null,
            message: 'Cart not found',
            code: EErrors.CART_NOT_FOUND,
          }),
        );
      }
    } catch (err) {
      return next(
        CustomError.createError({
          name: 'GetCartByIdError',
          cause: err,
          message: 'Error retrieving cart by ID',
          code: EErrors.DATABASE_ERROR,
        }),
      );
    }
  };

  addProductToCart = async (req, res, next) => {
    try {
      const cartId = res.locals.cartId;
      const productId = req.params.pid;
      const quantity = req.body.quantity;
      const user = req.user;
      const updatedCart = await this.cartService.addProductToCart(
        cartId,
        productId,
        quantity,
        user,
      );
      logger.info(`Attempting to add product with ID: ${productId} to cart with ID: ${cartId}`);
      if (updatedCart) {
        res.cookie('productAdded', 'true');
        res.redirect('/view/products');
      } else {
        return next(
          CustomError.createError({
            name: 'ProductCartError',
            cause: null,
            message: 'Cart or Product not found',
            code: EErrors.PRODUCT_NOT_IN_CART,
          }),
        );
      }
    } catch (err) {
      logger.error('Error adding product to cart: ' + err.message);
      return next(
        CustomError.createError({
          name: 'AddProductToCartError',
          cause: err,
          message: 'Error adding product to cart',
          code: EErrors.DATABASE_ERROR,
        }),
      );
    }
  };

  deleteProductFromCart = async (req, res, next) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const updatedCart = await this.cartService.deleteProductFromCart(cartId, productId);

      res.status(200).json({
        message: 'Product deleted from cart successfully',
        cart: updatedCart,
      });
    } catch (err) {
      logger.error('Error deleting product: ' + err.message);
      return next(
        CustomError.createError({
          name: 'DeleteProductFromCartError',
          cause: err,
          message: 'Error deleting product from cart',
          code: EErrors.DATABASE_ERROR,
        }),
      );
    }
  };

  updateCart = async (req, res, next) => {
    try {
      const cartId = req.params.cid;
      const products = req.body.products;

      await this.cartService.updateCart(cartId, products);

      res.status(200).json({message: 'Cart updated successfully'});
    } catch (err) {
      return next(
        CustomError.createError({
          name: 'UpdateCartError',
          cause: err,
          message: 'Error updating cart',
          code: EErrors.CART_VALIDATION_ERROR,
        }),
      );
    }
  };

  updateProductQuantity = async (req, res, next) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const quantity = req.body.quantity;

      const updatedCart = await this.cartService.updateProductQuantity(cartId, productId, quantity);

      res.status(200).json({
        message: 'Product quantity updated successfully',
        cart: updatedCart,
      });
    } catch (err) {
      return next(
        CustomError.createError({
          name: 'UpdateProductQuantityError',
          cause: err,
          message: 'Error updating product quantity in cart',
          code: EErrors.CART_VALIDATION_ERROR,
        }),
      );
    }
  };

  clearCart = async (req, res, next) => {
    try {
      const cartId = req.params.cid;

      await this.cartService.clearCart(cartId);

      res.status(200).json({message: 'Cart cleared successfully'});
    } catch (err) {
      return next(
        CustomError.createError({
          name: 'ClearCartError',
          cause: err,
          message: 'Error clearing cart',
          code: EErrors.DATABASE_ERROR,
        }),
      );
    }
  };

  finalizePurchase = async (req, res, next) => {
    try {
      const cartId = req.params.cid;
      const userEmail = req.user.email;

      const result = await this.cartService.finalizePurchase(cartId, userEmail);

      if (result.unprocessedProducts.length > 0) {
        res.status(400).json({
          message: 'Some products could not be processed due to insufficient stock.',
          unprocessedProducts: result.unprocessedProducts,
        });
      } else {
        res.json({
          message: 'Purchase finalized successfully',
          ticket: result.ticket,
        });
      }
    } catch (err) {
      logger.error('Error finalizing purchase: ' + err.message);
      return next(
        CustomError.createError({
          name: 'FinalizePurchaseError',
          cause: err,
          message: 'Error finalizing purchase',
          code: EErrors.DATABASE_ERROR,
        }),
      );
    }
  };
  renderCart = async (req, res, next) => {
    try {
      const cartId = res.locals.cartId;
      const cart = await this.cartService.getCartById(cartId);
      const products = cart.products.map(product => ({
        id: product.product._id.toString(),
        title: product.product.title,
        quantity: product.quantity,
        price: product.product.price,
      }));
      res.render('cart', {products});
    } catch (err) {
      logger.error('Error rendering cart: ' + err.message);

      return next(
        CustomError.createError({
          name: 'RenderingCartError',
          cause: err,
          message: 'Error rendering cart',
          code: EErrors.DATABASE_ERROR,
        }),
      );
    }
  };
}

let cartsController;

export const initializeCartsController = async () => {
  if (!cartsController) {
    cartsController = new CartsController();
    await cartsController.init();
  }
  return cartsController;
};
