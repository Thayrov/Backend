import MongoSingleton from '../src/config/mongo.config.js';
import chai from 'chai';
import {initializeApp} from '../src/app.js';
import mongoose from 'mongoose';
import supertest from 'supertest';

const expect = chai.expect;
let server;
let requester;
let agent;

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
	await agent
		.post('/api/users/login')
		.send({email: 'testUser@test.com', password: 'testPassword'});
});

after(async () => {
	this.timeout(5000);

	await mongoose.connection.close();
	await server.close();
	await requester.get('/logout');
});

describe('Testing products', () => {
	describe('GET /api/products', () => {
		it('should return an array of products', async () => {
			const {statusCode, body} = await agent.get('/api/products');
			expect(statusCode).to.equal(200);
			expect(body.payload).to.be.an('array');
		});
	});

	describe('GET /api/products/:pid', () => {
		it('should return a single product', async () => {
			const {statusCode, body} = await agent.get(
				'/api/products/648ab9b49195debc523c885b',
			);
			expect(statusCode).to.equal(200);
			expect(body.product).to.be.an('object');
		});
	});

	describe('POST /api/products', () => {
		it('should create a new product', async () => {
			const newProduct = {
				title: 'New Product',
				description: 'New Product Description',
				code: 'NEW_CODE',
				price: 100,
				stock: 10,
			};
			const {statusCode, body} = await agent
				.post('/api/products')
				.send(newProduct);
			expect(statusCode).to.equal(201);
			expect(body).to.include(newProduct);
		});
	});

	describe('PUT /api/products/:pid', () => {
		it('should update an existing product', async () => {
			const updatedProduct = {
				title: 'Updated Product',
				description: 'Updated Product Description',
				price: 150,
				stock: 15,
			};
			const {statusCode, body} = await agent
				.put('/api/products/1')
				.send(updatedProduct);
			expect(statusCode).to.equal(200);
			expect(body).to.include(updatedProduct);
		});
	});

	describe('DELETE /api/products/:pid', () => {
		it('should delete an existing product', async () => {
			const {statusCode, body} = await agent.delete('/api/products/1');
			expect(statusCode).to.equal(200);
			expect(body.message).to.equal('Product deleted successfully');
		});
	});
});
