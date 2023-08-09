import {DAOFactory} from '../dao/factory.js';

class TicketService {
	async init() {
		this.ticketDAO = await DAOFactory('tickets');
	}

	async createTicket(ticketData) {
		try {
			return await this.ticketDAO.create(ticketData);
		} catch (error) {
			console.error(error);
			throw error;
		}
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
