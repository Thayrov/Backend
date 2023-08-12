import faker from 'faker';

export class MockService {
	generateMockProducts(count = 100) {
		const products = [];

		for (let i = 0; i < count; i++) {
			products.push({
				name: faker.commerce.productName(),
				price: faker.commerce.price(),
				description: faker.commerce.productDescription(),
				image: faker.image.imageUrl(),
			});
		}

		return products;
	}
}

let mockService;

export const initializeMockService = async () => {
	if (!mockService) {
		mockService = new MockService();
	}
	return mockService;
};
