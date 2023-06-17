import {Schema, model} from 'mongoose';

const cartSchema = new Schema({
	id: String,
	products: [
		{
			product: {type: Schema.Types.ObjectId, ref: 'Product'},
			quantity: Number,
		},
	],
});

const CartModel = model('Cart', cartSchema);

export default CartModel;
