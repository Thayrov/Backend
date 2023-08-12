import bcrypt from 'bcrypt';

export const createHash = async password =>
	bcrypt.hash(password, await bcrypt.genSalt(10));
export const isValidPassword = (password, hashPassword) =>
	bcrypt.compare(password, hashPassword);
