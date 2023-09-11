import ProductModel from './models/products.model.js';

class ProductMongoDAO {
	async create(product) {
		return await ProductModel.create(product);
	}

	async findAll() {
		return await ProductModel.find();
	}

	async findByCode(code) {
		return await ProductModel.findOne({code});
	}

	async update(code, product) {
		return await ProductModel.findOneAndUpdate({code}, product, {new: true});
	}

	async delete(code) {
		return await ProductModel.findOneAndDelete({code});
	}
}

export default new ProductMongoDAO();
