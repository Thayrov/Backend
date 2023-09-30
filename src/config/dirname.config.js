import {fileURLToPath} from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __configDirname = path.dirname(__filename);

const rootDir = path.resolve(__configDirname, '../');

export {__configDirname, rootDir};

export const isMainModule =
	path.resolve(process.argv[1]) === path.resolve(`${rootDir}/app.js`);

export const ensureDirExists = dirPath => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, {recursive: true});
	}
};
