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

    pool.query(queries.query.login, [data.email, data.password], (err, result1) => {
        if (result1.rowCount == 1) {
            pool.query(queries.query.get_roles, [result1.rows[0].email], (err, result2) => {
                if (result1.rowCount == 1) {
                    console.log("\nLOGIN SUCCESSFUL\n");
                    console.log(result2.rows[0]);
                    res.status(200).send(result2.rows[0]);
                } else {
                    // Return Error 404 user does not exists
                    res.status(400).send("Error populating roles");
                }
            });
        } else {
            // Return Error 404 user does not exists
            res.status(400).send("Incorrect email or password");
        }
    });
});

module.exports = router;
