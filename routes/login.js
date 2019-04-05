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
	res.render('login', {title: 'Petcare - Login Page'});
}

function runPostQuery(req, res) {

	var email = req.body.email;
	var password = req.body.password;

	var sql_query = 'SELECT * FROM users WHERE email = \'' + email + '\' and password = \'' + password + '\';';

	pool.query(sql_query, (err, data) => {
		if (data.rowCount == 1) {
			res.render('index', {title: 'Login Successful - Welcome to Petcare'});
		} else {
			res.redirect('login');
		}
	});
}

/**********************************************/

app.get('/', function(req, res, next) {
	runGetQuery(res);
});

app.post('/', function(req, res, next) {
	runPostQuery(req, res);
});

app.route('/register').get(function(req, res, next) {
	res.render('register', {title: 'Petcare - Register Page'});
});

/**********************************************/

router.get('/', function(req, res, next) {
	res.render('login', { title: 'Petcare - Login Page' });
});


router.post('/', function(req, res, next) {
	runPostQuery(req, res);
});

module.exports = router, app;