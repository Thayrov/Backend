import {
	getUserIdByEmail,
	initializeTestEnvironment,
	loginUser,
	tearDownTestEnvironment,
	testAuthUser,
	testToggleRoleUser,
	testUser,
} from './test-helpers.js';

import chai from 'chai';

const expect = chai.expect;
let server;
let requester;
let agent;
let testUserId;

before(async function () {
	this.timeout(10000);
	({server, requester, agent} = await initializeTestEnvironment());
});

after(async function () {
	this.timeout(10000);
	await tearDownTestEnvironment(server, requester);
});

describe('Testing Auth Router', function () {
	this.timeout(10000);
	describe('POST /api/users/register', () => {
		it('should register a user', async () => {
			const res = await requester
				.post('/api/users/register')
				.send(testAuthUser);
			expect(res.status).to.equal(302);
		});
	});
	describe('POST /api/users/login', () => {
		it('should log in a user', async () => {
			const res = await requester.post('/api/users/login').send(testUser);
			expect(res.status).to.equal(302);
		});
	});
	describe('GET /logout', () => {
		it('should log out a user', async () => {
			await loginUser(agent, testUser);
			const res = await agent.get('/logout');
			expect(res.status).to.equal(302);
		});
	});
	describe('GET /api/users/current', () => {
		it('should get current user', async () => {
			await loginUser(agent, testUser);
			const res = await agent.get('/api/users/current');
			expect(res.status).to.equal(200);
			expect(res.body.user).to.have.property('email', testUser.email);
		});
	});
	describe('PUT /api/users/premium/:uid', () => {
		it('should toggle user role', async () => {
			await loginUser(agent, testToggleRoleUser);
			testUserId = await getUserIdByEmail(testToggleRoleUser.email);
			const res = await agent.put(`/api/users/premium/${testUserId}`);
			expect(res.status).to.equal(200);
			expect(res.body).to.have.property('message', 'User role updated');
		});
	});
});
