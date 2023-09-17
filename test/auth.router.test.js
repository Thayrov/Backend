import {
	initializeTestEnvironment,
	loginUser,
	tearDownTestEnvironment,
	testUser,
} from './test-helpers.js';

import chai from 'chai';

const expect = chai.expect;
let server;
let requester;
let agent;

before(async function () {
	this.timeout(10000);
	({server, requester, agent} = await initializeTestEnvironment());
	await loginUser(agent, testUser);
});

after(async function () {
	this.timeout(10000);
	await tearDownTestEnvironment(server, requester);
});

describe('Testing Users', function () {
	this.timeout(10000);
});
