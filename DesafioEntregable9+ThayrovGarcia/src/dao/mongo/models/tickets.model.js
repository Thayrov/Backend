import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
		unique: true,
		default: () => Math.random().toString(36).substr(2, 9).toUpperCase(),
	},
	purchase_datetime: {
		type: Date,
		default: Date.now,
	},
	amount: {
		type: Number,
		required: true,
	},
	purchaser: {
		type: String,
		required: true,
	},
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

export default TicketModel;
