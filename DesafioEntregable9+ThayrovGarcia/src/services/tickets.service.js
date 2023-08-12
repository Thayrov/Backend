import {DAOFactory} from '../dao/factory.js';

class TicketService {
	async init() {
		this.ticketDAO = await DAOFactory('tickets');
	}

	async createTicket(ticketData) {
		return await this.ticketDAO.create(ticketData);
	}
}

let ticketService;

export const initializeTicketService = async () => {
	if (!ticketService) {
		ticketService = new TicketService();
		await ticketService.init();
	}
	return ticketService;
};
