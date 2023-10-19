import * as fs from 'fs/promises';
import {logger} from '../../../config/logger.config.js';

export class TicketsManager {
  static #instance;
  constructor(path) {
    if (TicketsManager.#instance) {
      logger.info('Already connected');
      return TicketsManager.#instance;
    }
    this.path = path;
    this.tickets = [];
    this.lastId = 0;
    this.connect();
    TicketsManager.#instance = this;
    return this;
  }

  async connect() {
    try {
      const data = await fs.readFile(this.path, {encoding: 'utf-8'});
      if (data) {
        this.tickets = JSON.parse(data);
        this.lastId = this.tickets.length > 0 ? this.tickets[this.tickets.length - 1].id : 0;
      }
    } catch (error) {
      logger.error(`Error initializing Tickets Manager: ${error.message}`);
    }
  }

  async save() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.tickets, null, 2));
      logger.info('Tickets Manager saved successfully');
    } catch (error) {
      logger.error(`Error saving Tickets Manager: ${error.message}`);
    }
  }

  async addTicket(ticketData) {
    this.lastId++;
    const newTicket = {
      id: this.lastId.toString(),
      ...ticketData,
      code: Math.random().toString(36).substr(2, 9).toUpperCase(),
      purchase_datetime: new Date(),
    };
    this.tickets.push(newTicket);
    await this.save();
    logger.info('Ticket added successfully');
    return newTicket;
  }

  async getTickets() {
    return this.tickets;
  }

  async getTicketById(id) {
    const ticket = this.tickets.find(t => t.id === id);
    if (!ticket) {
      logger.error('Ticket not found');
      return null;
    }
    return ticket;
  }

  async updateTicket(id, updatedFields) {
    const ticket = this.tickets.find(t => t.id === id);
    if (!ticket) {
      logger.error('Ticket not found');
      return null;
    }
    const updatedTicket = {...ticket, ...updatedFields};
    this.tickets = this.tickets.map(t => (t.id === id ? updatedTicket : t));
    await this.save();
    logger.info('Ticket updated successfully');
    return updatedTicket;
  }

  async deleteTicket(id) {
    const ticketIndex = this.tickets.findIndex(t => t.id === id);
    if (ticketIndex === -1) {
      logger.error('Ticket not found');
      return null;
    }
    const deletedTicket = this.tickets.splice(ticketIndex, 1)[0];
    await this.save();
    logger.info('Ticket deleted successfully');
    return deletedTicket;
  }
}
