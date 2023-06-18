import {Schema, model} from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2';

const cartSchema = new Schema(
	{
		products: {
			type: [
				{
					product: {
						type: Schema.Types.ObjectId,
						ref: 'Product',
					},
					quantity: {type: Number, min: 1},
				},
			],
			required: true,
		},
	},
	{collection: 'carts', toJSON: {virtuals: true}},
);

/* cartSchema.pre(['find', 'findOne', 'findById'], function () {
	this.populate('products.product');
}); */
cartSchema.pre('findOne', function () {
	this.populate('products.product');
});

cartSchema.plugin(mongoosePaginate);

const CartModel = model('Cart', cartSchema);

export default CartModel;
