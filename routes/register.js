var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

router.post('/', function (req, res, next) {
	const data = {
		email: req.body.email,
		password: req.body.password,
		role: req.body.role
	};
	console.log(data);
	const sql_query = 'INSERT INTO users(email, password) VALUES($1, $2)';
	const values = [data.email, data.password];

	if (data.role === 'Pet Owner') {
		// Write into care taker with pet owner
	} else {
		// Care taker
	}

	// TODO: Make SQL query a transaction and insert into caretakers Table
	pool.query(sql_query, values, (err, result) => {
		// TODO: Make SQL query.
		// Check for duplicate email and return 400 if email already exists.
	});
});

module.exports = router;