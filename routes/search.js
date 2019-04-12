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

        reqType:         req.body.post,
        bid:             req.body.bid,
        petownerEmail:   req.body.petownerEmail,
        caretakeremail:  req.body.caretakeremail, 
        rating:          req.body.rating,
        bidamount:       req.body.bidamount,
        dateofservice:   req.body.dateofservice, 
        serviceid:       req.body.serviceid,
    };

    //request types: 
    //findCaretakerService:search for caretakers on specific date(input: date, service(1 service or NULL if any service) output: caretakerEmail, dateOfService, current highest bid)
    //addBid: adds bid for caretaker on specific date(input: bidderEmail, caretakerEMail, bidAmount, dateOfService, output: bidAmount, amount left in wallet(?), bidTimeStamp, won:true/false(?))

    switch (data.reqType) {

        case "searchCaretakers":
            pool.query(queries.query.find_services, [data.dateofservice, data.serviceid, data.bidamount, data.rating], (err, result) => {
                if (err) {
                    // Return Error 400 if can't get availability, shouldn't happen
                    res.status(400).send(err.stack);

                } else {
                    console.log(result.rows);
                    res.send(result.rows);
                }
            });
            break;

        case "addBid":
            pool.query(queries.query.make_bid, [data.petownerEmail, data.caretakeremail, data.bidamount, data.dateofservice], (err, result) => {
                if (err) {
                    res.status(400).send(err.message);

                } else {
                    console.log(result);
                    pool.query(queries.query.get_wallet_amt, [data.petownerEmail], (err, result2) => {
                        if (err) {
                            res.status(400).send(err.message);

                        } else {
                            console.log(result);

                            res.send(result.rows + result2.rows);
                        }
                    });
                }
            });
            break;

        case "updateBid":
            pool.query(queries.query.update_bid, [data.bid, data.bidamount], (err, result) => {
                if (err) {
                    // Return Error 400 if can't get availability, shouldn't happen
                    res.status(400).send(err.stack);

                } else {
                    console.log(result.rows);
                    res.send(result.rows);
                }
            });
            break;

        case "getCurrentBids":
            pool.query(queries.query.get_current_bids, [data.petownerEmail], (err, result) => {
                if (err) {
                    // Return Error 400 if can't get availability, shouldn't happen
                    res.status(400).send(err.stack);

                } else {
                    console.log(result.rows);
                    res.send(result.rows);
                }
            });
            break;

        case "getAllCompletedServices":
            pool.query(queries.query.get_all_completed_services, [data.petownerEmail], (err, result) => {

                console.log(result.rows);

                if (err) {
                    res.status(400).send(err.message);

                } else {
                    console.log(result.rows);
                    res.send(result.rows);
                }
            });
            break;
    }
});

module.exports = router;
