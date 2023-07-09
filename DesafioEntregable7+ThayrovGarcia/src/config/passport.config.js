import {githubClientID, githubClientSecret} from './env.js';

import AuthService from '../services/auth.service.js';
import {Strategy as GitHubStrategy} from 'passport-github2';
import {Strategy as LocalStrategy} from 'passport-local';
import {isValidPassword} from '../utils.js';
import passport from 'passport';

const iniPassport = () => {
	// Local Register Strategy
	passport.use(
		'local.register',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			async (req, email, password, done) => {
				try {
					const existingUser = await UserModel.findOne({email});
					if (existingUser) {
						return done(
							null,
							false,
							req.flash('signupMessage', 'That email is already taken.'),
						);
					}
					const newUser = new UserModel({email, password});
					const savedUser = await newUser.save();
					return done(null, savedUser);
				} catch (err) {
					return done(err);
				}
			},
		),
	);

	// Local Login Strategy
	passport.use(
		'local.login',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			async (req, email, password, done) => {
				try {
					const user = await UserModel.findOne({email});
					if (!user) {
						return done(
							null,
							false,
							req.flash('loginMessage', 'No user found.'),
						);
					}
					if (!isValidPassword(password, user.password)) {
						return done(
							null,
							false,
							req.flash('loginMessage', 'Wrong password.'),
						);
					}
					return done(null, user);
				} catch (err) {
					return done(err);
				}
			},
		),
	);

	// GitHub Strategy
	passport.use(
		new GitHubStrategy(
			{
				clientID: githubClientID,
				clientSecret: githubClientSecret,
				callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await UserModel.findOne({githubId: profile.id});
					if (user) {
						return done(null, user);
					}
					user = await UserModel.create({
						githubId: profile.id,
						email: profile.emails[0].value,
						name: profile.displayName,
						password: createHash(accessToken.substring(0, 10)),
					});
					return done(null, user);
				} catch (err) {
					return done(err);
				}
			},
		),
	);
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		UserModel.findById(id, (err, user) => {
			done(err, user);
		});
	});
};

export default iniPassport;
