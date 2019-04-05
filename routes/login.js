var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

// Returns a user given an emaiil and password
router.get('/', function (req, res, next) {
	res.send("Hello world");
});


// Attempts to login a user
router.post('/', function (req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	var sql_query = 'SELECT * FROM users WHERE email = \'' + email + '\' and password = \'' + password + '\';';

	pool.query(sql_query, (err, data) => {
		if (data.rowCount == 1) {
			// TODO: Return user object.
			res.send();
		} else {
			// Return Error 404 user does not exists
			res.redirect('login');
		}
	});
});

module.exports = router;