const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 8080;

app
	.use(bodyParser.json())
	/// PARSE JSON REQUESTS
	.use(
		session({
			secret: 'secret',
			resave: false,
			saveUninitialized: true,
		})
	)
	/// BASIC EXPRESS SESSION INITIALIZATION
	.use(passport.initialize())
	/// INIT PASSPORT ON EVERY ROUTE CALL
	.use(passport.session())
	/// ALLOW PASSPORT TO USE EXPRESS-SESSION
	.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept, Z-key, Authorization'
		);
		// res.setHeader('Content-Type', 'application/json');
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, PUT, PATCH, DELETE, OPTIONS'
		);
		next();
	})
	.use(cors({ methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }))
	.use(cors({ origin: '*' }))
	//.use('/auth', require('./routes/auth'))
	.use('/', require('./routes/index'));

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: process.env.GITHUB_CALLBACK_URL,
		},
		function (accessToken, refreshToken, profile, done) {
			// User.findOrCreate({ githubId: profile.id }, function (err, user) {
			return done(null, profile);
			// });
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((user, done) => {
	done(null, user);
});

app.get('/', (req, res) => {
	res.send(
		req.session.user !== undefined
			? `Logged in as ${req.session.user.username}`
			: 'Logged Out'
	);
});

app.get(
	'/github/callback',
	passport.authenticate('github', {
		failureRedirect: '/api-docs',
		session: false,
	}),
	(req, res) => {
		req.session.user = req.user;
		res.redirect('/');
	}
);

//CHECK FOR ANY ERROR
process.on('uncaughtException', (err, origin) => {
	console.log(
		process.stderr.fd,
		`Caught exception: ${err}\n` + `Exception origin: ${origin}`
	);
});

mongodb.initDb((error) => {
	if (error) {
		console.log(error);
	} else if (require.main === module) {
		app.listen(port, () => {
			console.log(`Database and Node is Running on Port ${port}`);
		});
	}
});

module.exports = app;
