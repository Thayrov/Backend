import MongoSingleton from '../src/config/mongo.config.js';
import UserModel from '../src/dao/mongo/models/user.model.js';
import {initializeApp} from '../src/app.js';
import mongoose from 'mongoose';
import supertest from 'supertest';

export const testUser = {
	email: 'testUser@test.com',
	password: 'testPassword',
};
export const testNonAdminUser = {
	email: 'manuelg@gmail.com',
	password: '123',
};
export const testAuthUser = {
	email: `testRegister${Math.random()}@test.com`,
	password: 'testPassword',
};
export const testToggleRoleUser = {
	email: `testRegister0.09858044218141582@test.com`,
	password: 'testPassword',
};

export async function initializeTestEnvironment() {
	await MongoSingleton.getInstance();
	const app = await initializeApp();
	const server = app.listen(0); // Listen on a random free port
	const {port} = server.address();
	const requester = supertest(`http://localhost:${port}`);
	const agent = supertest.agent(server);
	return {server, requester, agent};
}

export async function loginUser(agent, testUser) {
	await agent.post('/api/users/login').send(testUser);
}

export async function tearDownTestEnvironment(server, requester) {
	await requester.get('/logout');
	await server.close();
	await mongoose.disconnect();
}

export async function getUserIdByEmail(email) {
	const user = await UserModel.findOne({email: email});
	return user._id;
}
