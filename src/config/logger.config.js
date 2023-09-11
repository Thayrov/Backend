import winston from 'winston';

const levels = {
	fatal: 0,
	error: 1,
	warn: 2,
	info: 3,
	http: 4,
	debug: 5,
};

const colors = {
	debug: 'blue',
	http: 'green',
	info: 'cyan',
	warn: 'yellow',
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
