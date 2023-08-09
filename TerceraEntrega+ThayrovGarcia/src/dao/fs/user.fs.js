import {UserManager} from './managers/user.manager.js';

class UserFSDAO {
	constructor() {
		this.manager = new UserManager('./src/dao/fs/db/users.json');
	}

	async create(userData) {
		return await this.manager.createUser(userData);
	}

	async findAll() {
		return await this.manager.getAllUsers();
	}

	async findById(id) {
		return await this.manager.getUserById(id);
	}

	async findOne(query) {
		if (query.email) {
			return this.manager.getUserByEmail(query.email);
		}
		return null;
	}

	async update(id, updatedData) {
		return await this.manager.updateUser(id, updatedData);
	}

	async delete(id) {
		return await this.manager.deleteUser(id);
	}
}

export default new UserFSDAO();
