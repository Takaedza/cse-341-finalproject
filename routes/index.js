const passport = require('passport');
const router = require('express').Router();


router.use('/', require('./swagger'));
router.use('/customers', require('./customers'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));
router.use('/credits', require('./credit'));

//Login routes
router.get('/login', passport.authenticate('github'), (req, res) => {
	// req.session.user = "mandies";
	// res.send("Session is set");
});

router.get('/logout', function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
});

module.exports = router;
