var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/**********************************************/

function runGetQuery(res) {
	res.render('register', {title: 'Petcare - Register Page'});
}

function runPostQuery(req, res) {
	const data = {
		email: req.body.email,
		name: req.body.name,
		phone: req.body.phone,
		age: req.body.age,
		password: req.body.password
	};

	const sql_query = 'INSERT INTO users(email, name, phone, age, password) VALUES($1, $2, $3, $4, $5)';
	const values = [data.email, data.name, data.phone, data.age, data.password];

	pool.query(sql_query, values, (err, result) => {
		res.render('login', {title: 'User Creation Successful'});
	});
}

/**********************************************/

app.get('/', function(req, res, next) {
	runGetQuery(res);
});

app.post('/', function(req, res, next) {
	runPostQuery(req, res);
});

/**********************************************/

router.get('/', function(req, res, next) {
	runGetQuery(res);
});


router.post('/', function(req, res, next) {
	runPostQuery(req, res);
});

module.exports = router, app;