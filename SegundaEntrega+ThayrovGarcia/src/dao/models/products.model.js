import {Schema, model} from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema(
	{
		title: {type: String, required: true},
		description: {type: String, required: true},
		code: {type: String, required: true, unique: true},
		price: {type: Number, required: true},
		stock: {type: Number, required: true},
		category: {type: String, required: true},
		status: {type: Boolean, required: true, default: true},
		thumbnails: [String],
	},
	{collection: 'products'},
);

productSchema.plugin(mongoosePaginate);

const ProductModel = model('Product', productSchema);

export default ProductModel;
