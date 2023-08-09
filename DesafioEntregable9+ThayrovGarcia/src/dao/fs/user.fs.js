import {UserManager} from './managers/user.manager.js';

const userManager = new UserManager('./src/dao/fs/db/users.json');

export default {
	create: async userData => userManager.createUser(userData),
	findAll: async () => userManager.getAllUsers(),
	findById: async id => userManager.getUserById(id),
	findOne: async query => {
		if (query.email) {
			return userManager.getUserByEmail(query.email);
		}
		return null;
	},
	update: async (id, updatedData) => userManager.updateUser(id, updatedData),
	delete: async id => userManager.deleteUser(id),
};
