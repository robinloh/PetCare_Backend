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
        email: req.body.email,
        autoAcceptedPrice: req.body.minAutoAcceptPrice
    };
    console.log(data);

    //request types: getAvailability:previously added availabilities(input: email output: startdate, enddate, price) , getWorkDates: get all confirmed bids (input: email output: DateOfService, petownerEmail, price), addAvailability: add avail(input: startdate, enddate, minAutoAcceptPrice, email output: startdate, enddate(?)) getAllService: get all available types service(input: nothing(?) output: all services), getMyService: get my provided service(input: email output: all provided service(?), addService: add service(input: array of services(?) output: all provided service(?), removeService: remove service (input: array of services(?) output: all provided service(?)), getBids: get all available bid dates and current highest bid(input: email output: dates, current highest bid), acceptBid: accept current highest bid of a specific day(input: caretakerEmail, dateOfService output: petownerEmail, dateOfService, Price?)
    switch (reqType) {
        case "getAvailability":
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
        case "getWorkDates":
            pool.query(queries.query.get_work_schedule, [data.email], (err, result) => {
                if (err) {
                    res.status(400).send(err.stack);

                } else {
                    console.log(result);
                    res.send(result);
                }
            });
            break;    
        case "addAvailability":
            pool.query(queries.query.add_availability, [data.startDate, data.endDate, data.email, data.autoAcceptedPrice], (err, result) => {
                if (err) {
                    res.status(400).send(err.stack);

                } else {
                    console.log(result);
                    res.send(result.rows);
                }
            });
            break;
        case "getAllService":
            pool.query(queries.query.get_all_services, (err, result) => {
                if (err) {
                    res.status(400).send(err.stack);

                } else {
                    console.log(result);
                    res.send(result);
                }
            });
            break;
        case "getMyService":
            pool.query(queries.query.get_provided_services, [data.email], (err, result) => {
                if (err) {
                    res.status(400).send(err.stack);

                } else {
                    console.log(result);
                    res.send(result);
                }
            });
            break;
    }


});

module.exports = router;