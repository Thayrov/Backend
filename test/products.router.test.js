import MongoSingleton from '../src/config/mongo.config.js';
import chai from 'chai';
import {initializeApp} from '../src/app.js';
import mongoose from 'mongoose';
import supertest from 'supertest';

const expect = chai.expect;
let server;
let requester;
let agent;
let productId;

const testUser = {
	email: 'testUser@test.com',
	password: 'testPassword',
};
before(async function () {
	this.timeout(10000);

	// Initialize MongoDB connection
	await MongoSingleton.getInstance();

	// Initialize express app
	const app = await initializeApp();
	server = app.listen(0); // Listen on a random free port
	const {port} = server.address();
	requester = supertest(`http://localhost:${port}`);

	// Create an agent for session persistence
	agent = supertest.agent(server);
	// Log in using the agent to maintain session state

	await agent.post('/api/users/login').send(testUser);
});

after(async function () {
	this.timeout(10000);
	await requester.get('/logout');
	await server.close();
	await mongoose.disconnect();
});

describe('Testing products', function () {
	this.timeout(10000);

	describe('GET /api/products', () => {
		it('should return an array of products', async () => {
			const {statusCode, body} = await agent.get('/api/products');
			expect(statusCode).to.equal(200);
			expect(body.payload).to.be.an('array');
		});
	});

	describe('POST /api/products', () => {
		it('should create a new product', async () => {
			const newTestProduct = {
				title: 'Test Product',
				description: 'Test Product Description',
				code: `NEW_CODE_${Math.random()}`,
				price: 100,
				stock: 10,
			};
			const {statusCode, body} = await agent
				.post('/api/products')
				.send(newTestProduct);
			productId = body._id;
			expect(statusCode).to.equal(200);
			expect(body).to.include(newTestProduct);
		});
	});

	describe('GET /api/products/:pid', () => {
		it('should return a single product', async () => {
			const {statusCode, body} = await agent.get(`/api/products/${productId}`);
			expect(statusCode).to.equal(200);
			expect(body.product).to.be.an('object');
		});
	});

	describe('PUT /api/products/:pid', () => {
		it('should update an existing product', async () => {
			if (!productId) {
				throw new Error('Product ID not available for update');
			}
			// Fetch the product to ensure it exists
			const fetchRes = await agent.get(`/api/products/${productId}`);
			if (fetchRes.statusCode !== 200) {
				throw new Error('Product not found in database');
			}
			const updatedProduct = {
				title: 'Updated Product',
				description: 'Updated Product Description',
				price: 150,
				stock: 15,
			};
			const res = await agent
				.put(`/api/products/${productId}`)
				.send(updatedProduct);
			expect(res.statusCode).to.equal(200);
			expect(res.body).to.include(updatedProduct);
			expect(res.body).to.not.have.property('error');
		});
	});

	describe('DELETE /api/products/:pid', () => {
		it('should delete an existing product', async () => {
			if (!productId) {
				throw new Error('Product ID not available for deletion');
			}
			const res = await agent.delete(`/api/products/${productId}`);
			expect(res.statusCode).to.equal(200);
			expect(res.body.message).to.equal(
				`Product with id ${productId} deleted successfully`,
			);
			expect(res.body).to.not.have.property('error');
		});
	});
});
