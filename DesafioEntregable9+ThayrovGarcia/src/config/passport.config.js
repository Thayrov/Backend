import {DAOFactory} from '../dao/factory.js';
import {Strategy as GitHubStrategy} from 'passport-github2';
import {Strategy as LocalStrategy} from 'passport-local';
import environment from './enviroment.config.js';
import {initializeAuthService} from '../services/auth.service.js';
import passport from 'passport';

const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = environment;
export default async function iniPassport() {
	const userDAO = await DAOFactory('user');
	const authService = await initializeAuthService();
	passport.use(
		'login',
		new LocalStrategy(
			{usernameField: 'email'},
			async (username, password, done) => {
				try {
					const user = await authService.loginUser(username, password);
					return done(null, user);
				} catch (err) {
					return done(err);
				}
			},
		),
	);

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
					const user = {
						email: username,
						first_name,
						last_name,
						age,
						role: 'user',
						password,
					};
					const userCreated = await authService.registerUser(user);
					return done(null, userCreated);
				} catch (e) {
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
				clientID: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
			},
			async (accessToken, _, profile, done) => {
				try {
					const user = await authService.githubAuth(accessToken, profile);
					return done(null, user);
				} catch (e) {
					console.log(e);
					return done(e);
				}
			},
		),
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		if (id === 'adminId') {
			const adminUser = {
				_id: 'adminId',
				email: 'adminCoder@coder.com',
				role: 'admin',
			};
			return done(null, adminUser);
		}
		let user = await userDAO.findById(id);
		done(null, user);
	});
}
