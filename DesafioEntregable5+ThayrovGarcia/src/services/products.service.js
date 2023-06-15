import Product from '../dao/models/products.model.js';

export const getAllProducts = async limit => {
	const products = await Product.find().limit(limit);
	return products;
};

export const getProductById = async id => {
	const product = await Product.findById(id);
	return product;
};

export const getProductByCode = async code => {
	const product = await Product.findOne({code});
	return product;
};

export const createProduct = async productData => {
	const newProduct = await Product.create(productData);
	return newProduct;
};

export const updateProduct = async (id, updatedFields) => {
	const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
		new: true,
	});
	return updatedProduct;
};

export const deleteProduct = async id => {
	const deletedProduct = await Product.findByIdAndDelete(id);
	return deletedProduct;
};
