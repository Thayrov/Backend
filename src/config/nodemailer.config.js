import environment from './environment.config.js';
import nodemailer from 'nodemailer';

const {GOOGLE_EMAIL, GOOGLE_PASS, PORT} = environment;

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	port: 587,
	auth: {
		user: GOOGLE_EMAIL,
		pass: GOOGLE_PASS,
	},
});

export const passwordResetMailOptions = (email, token) => ({
	from: GOOGLE_EMAIL,
	to: email,
	subject: 'Password Reset',
	html: `<html>
    <head>
        <title>Reset Password</title>
    </head>
    <body>
        <h1>Hello,</h1>
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste it into your browser to complete the process:</p>
        <a href="http://localhost:${PORT}/api/users/reset-password?token=${token}&email=${email}">Reset Password</a>
        <p>This link will expire in one hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    </body>
    </html>`,
});

export const accountDeletionNoticeMailOptions = user => ({
	from: GOOGLE_EMAIL,
	to: user.email,
	subject: 'Account Deletion Notice',
	html: `<html>
    <head>
        <title>Account Deletion</title>
    </head>
    <body>
        <h1>Hello ${user.first_name},</h1>
        <p>Your account has been deleted due to inactivity.</p>
        <p>If you wish to use our services again, you'll need to re-register.</p>
    </body>
    </html>`,
});

export const productDeletionNoticeMailOptions = (user, id) => ({
	from: GOOGLE_EMAIL,
	to: user.email,
	subject: 'Product Deletion Notice',
	html: `<html>
    <head>
        <title>Product Deletion</title>
    </head>
    <body>
        <h1>Hello ${user.first_name},</h1>
        <p>Your product with id ${id} has been deleted.</p>
        <p>If this is an error, please contact support.</p>
    </body>
    </html>`,
});
