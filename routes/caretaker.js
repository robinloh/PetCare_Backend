var express = require('express');
var queries = require('../models/queries');
var router = express.Router();

const {
    Pool
} = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

router.post('/', function (req, res, next) {
    const data = {
        reqType: req.body.post,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        email: req.body.email
    };
    console.log(data);

    switch (reqType) {
        case getAvailability:
            pool.query(queries.query.get_availability, [data.email], (err, result) => {
                if (err) {
                    // Return Error 400 if can't get availability, shouldn't happen
                    res.status(400).send(err.stack);

                } else {
                    console.log(result);
                    res.send(result);
                }
            });
            break;
        case addAvailability:
            pool.query(queries.query.add_availability, [data.startDate, data.endDate, data.email], (err, result) => {
                if (err) {
                    // Return Error 400 if can't get availability, shouldn't happen
                    res.status(400).send(err.stack);

                } else {
                    console.log(result);
                    res.send("Successfully added availability from " + data.startDate + " to " + data.endDate);
                }
            });
            break;
    }


});

module.exports = router;