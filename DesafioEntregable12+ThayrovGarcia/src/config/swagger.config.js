import {rootDir} from './dirname.config.js';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
	definition: {
		openapi: '3.0.1',
		info: {
			title: 'E-commerce DOCS',
			description: "This is an e-commerce's backend educational project.",
		},
	},
	apis: [`${rootDir}/docs/**/*.yaml`],
};
export const specs = swaggerJSDoc(swaggerOptions);
