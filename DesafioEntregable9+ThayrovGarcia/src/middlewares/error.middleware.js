import EErrors from '../services/errors/enums.js';

export default (error, req, res, next) => {
	console.log(error.cause);

	switch (error.code) {
		// 400 Bad Request
		case EErrors.INVALID_TYPES_ERROR:
		case EErrors.PRODUCT_VALIDATION_ERROR:
		case EErrors.CART_VALIDATION_ERROR:
		case EErrors.MESSAGE_VALIDATION_ERROR:
		case EErrors.TICKET_VALIDATION_ERROR:
		case EErrors.USER_VALIDATION_ERROR:
			res
				.status(400)
				.send({status: 'error', error: error.name, cause: error.cause});
			break;

		// 401 Unauthorized
		case EErrors.AUTHENTICATION_ERROR:
		case EErrors.INVALID_CREDENTIALS:
			res
				.status(401)
				.send({status: 'error', error: error.name, cause: error.cause});
			break;

		// 403 Forbidden
		case EErrors.AUTHORIZATION_ERROR:
		case EErrors.UNAUTHORIZED_ACTION:
			res
				.status(403)
				.send({status: 'error', error: error.name, cause: error.cause});
			break;

		// 404 Not Found
		case EErrors.ROUTING_ERROR:
		case EErrors.PRODUCT_NOT_FOUND:
		case EErrors.CART_NOT_FOUND:
		case EErrors.PRODUCT_NOT_IN_CART:
		case EErrors.MESSAGE_NOT_FOUND:
		case EErrors.TICKET_NOT_FOUND:
		case EErrors.USER_NOT_FOUND:
		case EErrors.USER_ALREADY_EXISTS:
			res
				.status(404)
				.send({status: 'error', error: error.name, cause: error.cause});
			break;

		// 500 Internal Server Error
		case EErrors.DATABASE_ERROR:
		case EErrors.PRODUCT_OUT_OF_STOCK:
			res
				.status(500)
				.send({status: 'error', error: error.name, cause: error.cause});
			break;

		default:
			res.status(500).send({status: 'error', error: 'Unhandled error'});
			break;
	}
};
