var express = require('express');
var router = express.Router();
var queries = require('../models/queries');

const {
    Pool
} = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


// Attempts to login a user
router.post('/', function (req, res, next) {
    const data = {
        email:req.body.email,
        password:req.body.password
    };

    pool.query(queries.query.login, [data.email, data.password], (err, result) => {
        if (result.rowCount == 1) {
            // TODO: Return user object.
            const user = result.rows[0];
            console.log(user);
            res.send(user);
        } else {
            // Return Error 404 user does not exists
            res.status(400).send("Incorrect email or password");
        }
    });
});

module.exports = router;
