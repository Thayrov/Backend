/* import mongoose from 'mongoose';

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
 */

import {connect} from 'mongoose';

export async function connectMongo() {
	const atlasURI =
		'mongodb+srv://thayrovg:m4FAi7aVYaNKXNyT@backend-cluster.8mvp8qv.mongodb.net/ecommerce'; //?retryWrites=true&w=majority';

	try {
		await connect(atlasURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// dbName: 'ecommerce',
		});
		console.log('Connected to MongoDB');
	} catch (e) {
		console.log(e);
		throw new Error('MongoDB connection error:');
	}
}
