import * as fs from 'fs/promises';
import {logger} from '../../../config/logger.config.js';

export class CartManager {
  static #instance;
  constructor(path) {
    if (CartManager.#instance) {
      logger.info('Already connected to CartManager');
      return CartManager.#instance;
    }
    this.path = path;
    this.carts = [];
    this.lastId = 0;
    this.connect();
    CartManager.#instance = this;
    return this;
  }

  async connect() {
    try {
      const data = await fs.readFile(this.path, {encoding: 'utf-8'});
      if (data) {
        this.carts = JSON.parse(data);
        this.lastId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
      }
    } catch (error) {
      logger.error(`Error initializing Cart Manager: ${error.message}`);
    }
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.path, {encoding: 'utf-8'});
      if (data) {
        this.carts = JSON.parse(data);
        this.lastId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
      }
    } catch (error) {
      logger.error(`Error initializing Cart Manager: ${error.message}`);
    }
  }

  async save() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
      logger.info('Cart Manager saved successfully.');
    } catch (error) {
      logger.error(`Error saving Cart Manager: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId) {
    const cart = this.carts.find(c => c.id === cartId);
    if (!cart) {
      logger.error('Cart not found');
      return null;
    }
    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity++;
      await this.save();
      logger.info('Product quantity updated successfully');
      return existingProduct;
    }
    const newProduct = {product: productId, quantity: 1};
    cart.products.push(newProduct);
    await this.save();
    logger.info('Product added to cart successfully');
    return newProduct;
  }

  async getCartById(id) {
    const cart = this.carts.find(c => c.id === id);
    if (!cart) {
      logger.error('Cart not found');
      return null;
    }
    return cart;
  }
}
