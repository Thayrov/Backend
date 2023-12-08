import dotenv from 'dotenv';
import {logger} from './logger.config.js';

const environment = {MODE: process.env.TEST_MODE || process.argv[2]};
const {MODE} = environment;

if (!['development', 'production'].includes(MODE)) {
  logger.error('You are not selecting a valid environment');
  process.exit();
}
dotenv.config({
  path: process.argv[2] === 'development' ? './.env.development' : './.env.production',
});

environment.PORT = process.env.PORT;
environment.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
environment.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
environment.GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;
environment.MONGO_URL = process.env.MONGO_URL;
environment.SESSION_SECRET = process.env.SESSION_SECRET;
environment.PERSISTANCE = process.env.PERSISTANCE;
environment.NODE_ENV = process.env.NODE_ENV;
environment.GOOGLE_EMAIL = process.env.GOOGLE_EMAIL;
environment.GOOGLE_PASS = process.env.GOOGLE_PASS;

export default environment;
