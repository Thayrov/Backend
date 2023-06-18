import {Schema, model} from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2';

const cartSchema = new Schema(
	{
		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
				},
				quantity: {
					type: Number,
					min: 1,
				},
			},
		],
	},
	{collection: 'carts'},
);

cartSchema.pre(['find', 'findOne', 'findById'], function () {
	this.populate('products.product');
});

cartSchema.plugin(mongoosePaginate);

const CartModel = model('Cart', cartSchema);

export default CartModel;
