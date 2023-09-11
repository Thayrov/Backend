import {fileURLToPath} from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __configDirname = path.dirname(__filename);

const rootDir = path.resolve(__configDirname, '../');

export {__configDirname, rootDir};
