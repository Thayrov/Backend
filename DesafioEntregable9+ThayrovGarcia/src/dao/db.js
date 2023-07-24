import environment from '../config/config.js';
import mongoose from 'mongoose';

const {MONGO_URL} = environment;

const atlasURI = MONGO_URL;

mongoose.connect(atlasURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	dbName: 'ecommerce',
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
	console.log('Connected to MongoDB');
});

export default db;
