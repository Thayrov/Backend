let tickets = [];

class TicketsMemoryDAO {
	async create(ticketData) {
		const newTicket = {
			id: tickets.length + 1,
			...ticketData,
			code: Math.random().toString(36).substr(2, 9).toUpperCase(),
			purchase_datetime: new Date(),
		};
		tickets.push(newTicket);
		return newTicket;
	}

	async findAll() {
		return tickets;
	}

	async findById(id) {
		return tickets.find(ticket => ticket.id === id);
	}

	async update(id, ticketData) {
		const index = tickets.findIndex(ticket => ticket.id === id);
		if (index === -1) {
			throw new Error('Ticket not found');
		}
		tickets[index] = {...tickets[index], ...ticketData};
		return tickets[index];
	}

	async delete(id) {
		const index = tickets.findIndex(ticket => ticket.id === id);
		if (index === -1) {
			throw new Error('Ticket not found');
		}
		const deletedTicket = tickets[index];
		tickets.splice(index, 1);
		return deletedTicket;
	}
}

export default new TicketsMemoryDAO();
