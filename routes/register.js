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