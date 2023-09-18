import {
	initializeTestEnvironment,
	loginUser,
	tearDownTestEnvironment,
	testNonAdminUser,
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
	await loginUser(agent, testNonAdminUser);
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

	describe('POST /api/carts/:cid/product/:pid', () => {
		it('should add a product to the cart', async () => {
			const newProduct = {
				productId: '6506a31891c88c0be660b195',
				quantity: 2,
			};
			const {statusCode, body} = await agent
				.post(`/api/carts/${cartId}/product/${newProduct.productId}`)
				.send({quantity: newProduct.quantity});
			expect(statusCode).to.equal(200);
			// Check if the newProduct exists in the cart
			const productExistsInCart = body.products.some(product => {
				return (
					product.product.toString() === newProduct.productId &&
					product.quantity === newProduct.quantity
				);
			});

			expect(productExistsInCart).to.be.true;
		});
	});
	describe('PUT /api/carts/:cid/products/:pid', () => {
		it('should update the quantity of a product in the cart', async () => {
			const productId = '6506a31891c88c0be660b195';
			const updatedQuantity = 4;
			const {statusCode, body} = await agent
				.put(`/api/carts/${cartId}/products/${productId}`)
				.send({quantity: updatedQuantity});
			expect(statusCode).to.equal(200);

			const updatedProduct = body.cart.products.find(
				p => p.product === productId,
			);

			expect(updatedProduct.quantity).to.equal(updatedQuantity);
		});
	});

	describe('DELETE /api/carts/:cid', () => {
		it('should empty the cart', async () => {
			const {statusCode, body} = await agent.delete(`/api/carts/${cartId}`);
			expect(statusCode).to.equal(200);
			expect(body.message).to.equal('Cart cleared successfully');
		});
	});

	describe('DELETE /api/carts/:cid/products/:pid', () => {
		it('should remove a product from the cart', async () => {
			const productId = '6506a31891c88c0be660b195';
			const {statusCode, body} = await agent.delete(
				`/api/carts/${cartId}/products/${productId}`,
			);
			expect(statusCode).to.equal(200);
			const productExistsInCart = body.cart.products.some(
				product => product.product.toString() === productId,
			);
			expect(productExistsInCart).to.be.false;
		});
	});
});
