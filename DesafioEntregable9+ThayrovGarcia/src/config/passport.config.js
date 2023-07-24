import {createHash, isValidPassword} from './bcrypt.js';

import {Strategy as GitHubStrategy} from 'passport-github2';
import {Strategy as LocalStrategy} from 'passport-local';
import UserModel from '../dao/models/user.model.js';
import environment from './config.js';
import fetch from 'node-fetch';
import passport from 'passport';

const {githubClientID, githubClientSecret} = environment;

export default function iniPassport() {
	// Local Login Strategy
	passport.use(
		'login',
		new LocalStrategy(
			{usernameField: 'email'},
			async (username, password, done) => {
				try {
					// Check for hardcoded admin user
					if (
						username === 'adminCoder@coder.com' &&
						password === 'adminCod3r123'
					) {
						const adminUser = {
							_id: 'adminId',
							email: 'adminCoder@coder.com',
							role: 'admin',
						};
						return done(null, adminUser);
					}

					const user = await UserModel.findOne({email: username});
					if (!user) {
						console.log('User Not Found with username (email) ' + username);
						return done(null, false);
					}
					if (!isValidPassword(password, user.password)) {
						console.log('Invalid Password');
						return done(null, false);
					}
					return done(null, user);
				} catch (err) {
					return done(err);
				}
			},
		),
	);

	// Local Register Strategy
	passport.use(
		'register',
		new LocalStrategy(
			{
				passReqToCallback: true,
				usernameField: 'email',
			},
			async (req, username, password, done) => {
				try {
					const {first_name, last_name, age} = req.body;
					let user = await UserModel.findOne({email: username});
					if (user) {
						console.log('User already exists');
						return done(null, false);
					}
					const hashedPassword = await createHash(password);
					const newUser = {
						email: username,
						first_name,
						last_name,
						age,
						role: 'user',
						password: hashedPassword,
					};
					let userCreated = await UserModel.create(newUser);
					console.log('User Registration successful');
					return done(null, userCreated);
				} catch (e) {
					console.log('Error in register');
					console.log(e);
					return done(e);
				}
			},
		),
	);

	// GitHub Strategy
	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: githubClientID,
				clientSecret: githubClientSecret,
				callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
			},
			async (accessToken, _, profile, done) => {
				try {
					const res = await fetch('https://api.github.com/user/emails', {
						headers: {
							Accept: 'application/vnd.github+json',
							Authorization: 'Bearer ' + accessToken,
							'X-Github-Api-Version': '2022-11-28',
						},
					});
					const emails = await res.json();
					const emailDetail = emails.find(email => email.verified == true);

					if (!emailDetail) {
						return done(new Error('cannot get a valid email for this user'));
					}
					profile.email = emailDetail.email;

					let user = await UserModel.findOne({email: profile.email});
					if (!user) {
						const newUser = {
							email: profile.email,
							first_name: profile._json.name || profile._json.login || 'noname',
							last_name: 'nolast',
							age: 0,
							role: 'user',
							password: createHash(accessToken.substring(0, 10)),
						};
						let userCreated = await UserModel.create(newUser);
						console.log('User Registration successful');
						return done(null, userCreated);
					} else {
						console.log('User already exists');
						return done(null, user);
					}
				} catch (e) {
					console.log('Error in GitHub auth');
					console.log(e);
					return done(e);
				}
			},
		),
	);
	passport.serializeUser((user, done) => {
		console.log('Serializing user:', user);
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		console.log('Deserializing user with id:', id);
		if (id === 'adminId') {
			const adminUser = {
				_id: 'adminId',
				email: 'adminCoder@coder.com',
				role: 'admin',
			};
			return done(null, adminUser);
		}
		let user = await UserModel.findById(id);
		done(null, user);
	});
}
