import winston from 'winston';

const levels = {
	debug: 0,
	http: 1,
	info: 2,
	warning: 3,
	error: 4,
	fatal: 5,
};

const colors = {
	debug: 'blue',
	http: 'green',
	info: 'cyan',
	warning: 'yellow',
	error: 'red',
	fatal: 'magenta',
};

winston.addColors(colors);

const format = winston.format.combine(
	winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
	winston.format.printf(
		info => `${info.timestamp} ${info.level}: ${info.message}`,
	),
);

const transports = [
	new winston.transports.File({
		filename: './errors.log',
		level: 'error',
		format: format,
	}),
];

if (process.env.NODE_ENV !== 'production') {
	transports.push(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize({all: true}),
				format,
			),
			level: 'debug',
		}),
	);
} else {
	transports.push(
		new winston.transports.Console({
			format: format,
			level: 'info',
		}),
	);
}

export const logger = winston.createLogger({
	levels: levels,
	format: format,
	transports: transports,
});
