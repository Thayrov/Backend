import * as fs from 'fs/promises';
import {logger} from '../../../config/logger.config.js';

export class UserManager {
  static #instance;
  constructor(path) {
    if (UserManager.#instance) {
      logger.info('Already connected to UserManager');
      return UserManager.#instance;
    }
    this.path = path;
    this.users = [];
    this.connect();
    UserManager.#instance = this;
    return this;
  }

  async connect() {
    try {
      const data = await fs.readFile(this.path, {encoding: 'utf-8'});
      if (data) {
        this.users = JSON.parse(data);
      }
    } catch (error) {
      logger.error(`Error initializing User Manager: ${error.message}`);
    }
  }

  async save() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.users, null, 2));
      logger.info('User Manager saved successfully.');
    } catch (error) {
      logger.error(`Error saving User Manager: ${error.message}`);
    }
  }

  async getAllUsers() {
    return this.users;
  }

  async createUser(userData) {
    this.users.push(userData);
    await this.save();
    logger.info('User added successfully');
    return userData;
  }

  async getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }
}
