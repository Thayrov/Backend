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
let cartId;

before(async function () {
	this.timeout(10000);
	({server, requester, agent} = await initializeTestEnvironment());
	await loginUser(agent, testUser);
});

after(async function () {
	this.timeout(10000);
	await tearDownTestEnvironment(server, requester);
});

describe('Testing carts', function () {
	this.timeout(10000);

	describe('POST /api/carts', () => {
		it('should create a new cart', async () => {
			const newCart = {};
			const {statusCode, body} = await agent.post('/api/carts').send(newCart);
			cartId = body._id;
			expect(statusCode).to.equal(201);
			expect(body).to.be.an('object');
		});
	});

	describe('GET /api/carts/:cid', () => {
		it('should return a cart by ID', async () => {
			const {statusCode, body} = await agent.get(`/api/carts/${cartId}`);
			expect(statusCode).to.equal(200);
			expect(body).to.be.an('object');
			expect(body._id).to.equal(cartId);
		});
	});

	describe('POST /api/carts/:cid/products', () => {
		it('should add a product to the cart', async () => {
			const newProduct = {
				productId: 'some-product-id',
				quantity: 2,
			};
			const {statusCode, body} = await agent
				.post(`/api/carts/${cartId}/products`)
				.send(newProduct);
			expect(statusCode).to.equal(200);
			expect(body.products).to.include(newProduct);
		});
	});

	describe('DELETE /api/carts/:cid/products/:pid', () => {
		it('should remove a product from the cart', async () => {
			const productId = 'some-product-id';
			const {statusCode, body} = await agent.delete(
				`/api/carts/${cartId}/products/${productId}`,
			);
			expect(statusCode).to.equal(200);
			expect(body.products).to.not.include({productId});
		});
	});

	describe('PUT /api/carts/:cid/products/:pid', () => {
		it('should update the quantity of a product in the cart', async () => {
			const productId = 'some-product-id';
			const updatedQuantity = 3;
			const {statusCode, body} = await agent
				.put(`/api/carts/${cartId}/products/${productId}`)
				.send({quantity: updatedQuantity});
			expect(statusCode).to.equal(200);
			const updatedProduct = body.products.find(p => p.productId === productId);
			expect(updatedProduct.quantity).to.equal(updatedQuantity);
		});
	});

	describe('DELETE /api/carts/:cid', () => {
		it('should empty the cart', async () => {
			const {statusCode, body} = await agent.delete(`/api/carts/${cartId}`);
			expect(statusCode).to.equal(200);
			expect(body.products).to.be.empty;
		});
	});

	describe('GET /api/carts/:cid (Unauthorized)', () => {
		it('should not allow unauthorized access', async () => {
			const {statusCode} = await requester.get(`/api/carts/${cartId}`);
			expect(statusCode).to.equal(401);
		});
	});
});
