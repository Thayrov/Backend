import TicketModel from './models/tickets.model.js';

class TicketMongoDAO {
	async create(ticketData) {
		return await TicketModel.create(ticketData);
	}

	async findByCode(code) {
		return await TicketModel.findOne({code});
	}

	async getAll() {
		return await TicketModel.find();
	}

	async getById(id) {
		return await TicketModel.findById(id);
	}

	async update(id, ticketData) {
		return await TicketModel.findByIdAndUpdate(id, ticketData, {new: true});
	}

	async delete(id) {
		return await TicketModel.findByIdAndDelete(id);
	}
}

export default new TicketMongoDAO();
