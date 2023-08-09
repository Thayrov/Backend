import {TicketsManager} from './managers/tickets.manager.js';

class TicketsFSDAO {
	constructor() {
		this.manager = new TicketsManager('./data/tickets.json');
	}

	async create(ticketData) {
		return await this.manager.addTicket(ticketData);
	}

	async findAll() {
		return await this.manager.getTickets();
	}

	async findById(id) {
		return await this.manager.getTicketById(id);
	}

	async update(id, ticketData) {
		return await this.manager.updateTicket(id, ticketData);
	}

	async delete(id) {
		return await this.manager.deleteTicket(id);
	}
}

export default new TicketsFSDAO();
