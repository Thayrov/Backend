class UserMemoryDAO {
	constructor() {
		this.users = [];
		this.currentId = 1;
	}

	async create(user) {
		const newUser = {...user, _id: this.currentId++};
		this.users.push(newUser);
		return newUser;
	}

	async findAll() {
		return this.users;
	}

	async findById(id) {
		return this.users.find(user => user._id === id);
	}

	async findOne(query) {
		return this.users.find(user => {
			for (let key in query) {
				if (user[key] !== query[key]) {
					return false;
				}
			}
			return true;
		});
	}

	async update(id, user) {
		const index = this.users.findIndex(u => u._id === id);
		if (index === -1) return null;

		this.users[index] = {...this.users[index], ...user};
		return this.users[index];
	}

	async delete(id) {
		const index = this.users.findIndex(u => u._id === id);
		if (index === -1) return null;

		const deletedUser = this.users.splice(index, 1);
		return deletedUser[0];
	}
}

export default new UserMemoryDAO();
