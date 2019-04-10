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

    //request types: 
    //findCaretakerService:search for caretakers on specific date(input: date, service(1 service or NULL if any service) output: caretakerEmail, dateOfService, current highest bid)
    //addBid: adds bid for caretaker on specific date(input: bidderEmail, caretakerEMail, bidAmount, dateOfService, output: bidAmount, amount left in wallet(?), bidTimeStamp, won:true/false(?))

    
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
