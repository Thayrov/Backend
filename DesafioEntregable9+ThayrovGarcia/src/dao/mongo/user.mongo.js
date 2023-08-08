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

	async update(id, user) {
		return await UserModel.findByIdAndUpdate(id, user, {new: true});
	}

	async delete(id) {
		return await UserModel.findByIdAndDelete(id);
	}
}

export default new UserMongoDAO();
