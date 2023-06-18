import mongoose from 'mongoose';

const atlasURI =
	'mongodb+srv://thayrovg:m4FAi7aVYaNKXNyT@backend-cluster.8mvp8qv.mongodb.net/?retryWrites=true&w=majority';

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
