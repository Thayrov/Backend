import {loginUser, registerUser} from '../controllers/auth.controller.js';

import express from 'express';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

export default authRouter;
