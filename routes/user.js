var express = require('express');
var router = express.Router();
var queries = require('../models/queries');

const {
    Pool
} = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


router.post('/', function (req, res, next) {
    const data = {
        reqType:  req.body.post,
        email:    req.body.email
    };

    switch (data.reqType) {

        case "getUserName":
            pool.query(queries.query.get_user_name, [data.email], (err, result) => {
                
                if (err) {
                    res.status(400).send(err.stack);
                }

                if (result.rowCount == 1) {
                    console.log(result.rows[0]);
                    res.send(result.rows[0]);
                } else {
                    res.status(400).send("Duplicate user names found with the same email. Check database.");
                }
            });
            break;

        case "getBadge":

            pool.query(queries.query.get_badge, [data.email], (err, result) => {
                
                if (err) {
                    res.status(400).send(err.stack);
                }

                console.log(result.rows[0]);
                res.send(result.rows[0]);
            });
        
    }
});

module.exports = router;
