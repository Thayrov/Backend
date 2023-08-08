import AuthService from '../services/auth.service.js';
import {DAOFactory} from '../dao/factory.js';
import {Strategy as GitHubStrategy} from 'passport-github2';
import {Strategy as LocalStrategy} from 'passport-local';
import environment from './config.js';
import passport from 'passport';

const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = environment;
const {loginUser, registerUser, githubAuth} = AuthService;
const userDAO = DAOFactory('user');

export default function iniPassport() {
	passport.use(
		'login',
		new LocalStrategy(
			{usernameField: 'email'},
			async (username, password, done) => {
				try {
					const user = await loginUser(username, password);
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
					const userCreated = await registerUser(user);
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
					const user = await githubAuth(accessToken, profile);
					return done(null, user);
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
		let user = await userDAO.findById(id);
		done(null, user);
	});
}
