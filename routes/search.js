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
        searchDate: req.body.searchDate,
        typeOfService: req.body.serviceType
    };
    console.log(data);

    pool.query(queries.query.find_services, [data.searchDate, data.typeOfService], (err, result) => {
        if (err) {
            // Return Error 400 if can't get availability, shouldn't happen
            res.status(400).send(err.stack);

        } else {
            console.log(result);
            res.send(result);
        }
    });


});

module.exports = router;
