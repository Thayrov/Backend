import dotenv from 'dotenv';

const environment = {MODE: process.argv[2]};
const {MODE} = environment;

if (MODE != 'development' && MODE != 'production') {
	console.error('You are not selecting a valid environment');
	process.exit();
}
dotenv.config({
	path:
		process.argv[2] === 'development'
			? './.env.development'
			: './.env.production',
});

environment.PORT = process.env.PORT;
environment.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
environment.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
environment.MONGO_URL = process.env.MONGO_URL;
environment.SESSION_SECRET = process.env.SESSION_SECRET;
environment.PERSISTANCE = process.env.PERSISTANCE;
environment.NODE_ENV = process.env.NODE_ENV;

export default environment;
