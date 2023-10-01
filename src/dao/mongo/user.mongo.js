import UserModel from './models/user.model.js';

class UserMongoDAO {
	async create(user) {
		return await UserModel.create(user);
	}

	async findAll() {
		return await UserModel.find();
	}

	async findById(id) {
		return await UserModel.findById(id);
	}

	async findOne(query) {
		return await UserModel.findOne(query);
	}

	async update(query, user) {
		return await UserModel.findOneAndUpdate(query, user, {new: true});
	}

	async delete(id) {
		return await UserModel.findByIdAndDelete(id);
	}
	async addDocuments(userId, documents) {
		return await UserModel.findByIdAndUpdate(
			userId,
			{$push: {documents: {$each: documents}}},
			{new: true},
		);
	}

	async updateLastConnection(userId, lastConnection) {
		return await UserModel.findByIdAndUpdate(
			userId,
			{last_connection: lastConnection},
			{new: true},
		);
	}
	async removeInactiveUsers(date) {
		const result = await UserModel.deleteMany({last_connection: {$lt: date}});
		return result;
	}
}

export default new UserMongoDAO();
