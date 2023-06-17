import * as cartService from '../services/carts.service.js';

export const getCartById = async (req, res) => {
	const id = req.params.cid;
	try {
		const cart = await Cart.findById(id).populate('products.product');
		if (cart) {
			res.render('cart', {products: cart.products});
		} else {
			res.status(404).send({error: 'Cart not found'});
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({error: 'Internal server error'});
	}
};

export const addProductToCart = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const productId = req.params.pid;

		// Llama a la función del servicio para agregar el producto al carrito
		const addedProduct = await cartService.addProductToCart(cartId, productId);

		if (addedProduct) {
			res.send(addedProduct);
		} else {
			res.status(404).send({error: 'Cart or Product not found'});
		}
	} catch (error) {
		console.error('Error adding product to cart:', error);
		res.status(500).send({error: 'Failed to add product to cart'});
	}
};

export const removeProductFromCart = async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;

	const removedProduct = await cartService.removeProductFromCart(
		cartId,
		productId,
	);

	if (removedProduct) {
		res.send({message: 'Product removed from cart successfully'});
	} else {
		res.status(404).send({error: 'Cart or Product not found'});
	}
};

export const updateCartProducts = async (req, res) => {
	const cartId = req.params.cid;
	const products = req.body;

	const updatedCart = await cartService.updateCartProducts(cartId, products);

	if (updatedCart) {
		res.send(updatedCart);
	} else {
		res.status(404).send({error: 'Cart not found'});
	}
};

export const updateProductQuantity = async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	const quantity = req.body.quantity;

	const updatedProduct = await cartService.updateProductQuantity(
		cartId,
		productId,
		quantity,
	);

	if (updatedProduct) {
		res.send(updatedProduct);
	} else {
		res.status(404).send({error: 'Cart or Product not found'});
	}
};

export const deleteCart = async (req, res) => {
	const cartId = req.params.cid;

	const deletedCart = await cartService.deleteCart(cartId);

	if (deletedCart) {
		res.send({message: `Cart with id ${cartId} deleted successfully`});
	} else {
		res.status(404).send({error: 'Cart not found'});
	}
};
