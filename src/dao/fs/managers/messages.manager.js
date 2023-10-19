import * as fs from 'fs/promises';
import {logger} from '../../../config/logger.config.js';

export class MessageManager {
  static #instance;
  constructor(path) {
    if (MessageManager.#instance) {
      logger.info('Already connected to MessageManager');
      return MessageManager.#instance;
    }
    this.path = path;
    this.messages = [];
    this.connect();
    MessageManager.#instance = this;
    return this;
  }

  async connect() {
    try {
      const data = await fs.readFile(this.path, {encoding: 'utf-8'});
      if (data) {
        this.messages = JSON.parse(data);
      }
    } catch (error) {
      logger.error(`Error initializing Message Manager: ${error.message}`);
    }
  }

  async save() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.messages, null, 2));
      logger.info('Message Manager saved successfully.');
    } catch (error) {
      logger.error(`Error saving Message Manager: ${error.message}`);
    }
  }

  async getAllMessages() {
    return this.messages;
  }

  async createMessage(messageData) {
    this.messages.push(messageData);
    await this.save();
    logger.info('Message added successfully');
    return messageData;
  }
}
