import express from 'express';
import {logger} from '../config/logger.config.js';

export const errorRouter = express.Router();

errorRouter.get('/', async (req, res) => {
	try {
		const errorMsg = req.session.errorMsg;
		req.session.errorMsg = null;
		return res.status(200).render('error', {errorMsg});
	} catch (err) {
		logger.error(err);
		res.status(501).send({status: 'error', msg: "Server's error", error: err});
	}
});
