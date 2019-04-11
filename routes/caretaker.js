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
        dateToRemove: req.body.dateToRemove,
        email: req.body.email,
        autoAcceptedPrice: req.body.autoAcceptedPrice,
        services: req.body.services,
        bid: req.body.bid
    };
    console.log(data);

    //request types: getAvailability:previously added availabilities(input: email output: {startdate, enddate, price})
    //getWorkDates: get all confirmed bids (input: email output: DateOfService, petownerEmail, price)
    //addAvailability: add avail(input: startdate, enddate, minAutoAcceptPrice, email output: startdate, enddate(?))
    //removeAvailabilities: remove availabilities (intput: email, {date(yyyy-mm-dd format)} output: {startdate, enddate, price})
    //getAllService: get all available types service(input: nothing(?) output: all services)
    //getMyService: get my provided service(input: email output: all provided service(?)
    //addService: add service(input: array of services(?) output: all provided service(?)
    //removeService: remove service (input: array of services(?) output: all provided service(?))
    //getAvgRating: get avg rating for caretaker (input: caretakerEmail output: avg rating)
    //getBids: get all available bid dates and current highest bid(input: email output: dates, petownerEmail, current highest bid)
    //acceptBid: accept current highest bid of a specific day(input: caretakerEmail, dateOfService output: petownerEmail, dateOfService, Price?)
    //getCompletedWork: gets all won bid before current time(input: caretakerEmail output: bid, DateOfService, petownerEmail, price)

    switch (data.reqType) {
        case "getAvailability":
            pool.query(queries.query.get_availability, [data.email], (err, result) => {
                if (err) {
                    // Return Error 400 if can't get availability, shouldn't happen
                    res.status(400).send(err.message);

                } else {
                    console.log(result.rows);
                    res.send(result.rows);
                }
            });
            break;
        case "getWorkDates":
            pool.query(queries.query.get_work_schedule, [data.email], (err, result) => {
                if (err) {
                    res.status(400).send(err.message);

                } else {
                    console.log(result.rows);
                    res.send(result.rows);
                }
            });
            break;    
        case "addAvailability":
            (async () => {
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    await client.query(queries.query.add_availability, [data.email, data.startDate, data.endDate, data.autoAcceptedPrice])
                    await client.query('COMMIT')
                    const results = await client.query(queries.query.get_availability, [data.email])
                    console.log(results);
                    res.send(results.rows);
                } catch (e) {
                    await client.query('ROLLBACK')
                    throw e
                } finally {
                    client.release()
                }
            })().catch(e => {console.error(e.message)
                res.status(400).send(e.message)})
            break;
        case "removeAvailabilities":
            (async () => {
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    await client.query(queries.query.delete_availability, [data.email, data.dateToRemove])
                    await client.query('COMMIT')
                    const result = await client.query(queries.query.get_availability, [data.email])
                    console.log(result.rows);
                    res.send(result.rows);
                } catch (e) {
                    await client.query('ROLLBACK')
                    throw e
                } finally {
                    client.release()
                }
            })().catch(e => {console.error(e.message)
                res.status(400).send(e.message)})
            break;
        case "getAllService":
            pool.query(queries.query.get_all_services, (err, result) => {
                if (err) {
                    res.status(400).send(err.message);

                } else {
                    console.log(result);
                    res.send(result.rows);
                }
            });
            break;
        case "getMyService":
            pool.query(queries.query.get_provided_services, [data.email], (err, result) => {
                if (err) {
                    res.status(400).send(err.message);

                } else {
                    console.log(result.rows);
                    res.send(result.rows);
                }
            });
            break;
        case "addService":
            (async () => {
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    //for loop to insert all new services
                    for (const service of data.services) {
                        await client.query(queries.query.add_service, [data.email, service])
                    }
                    await client.query('COMMIT')
                    const result = await client.query(queries.query.get_provided_services, [data.email])
                    console.log(result.rows);

                    res.send(result.rows);
                } catch (e) {
                    await client.query('ROLLBACK')
                    throw e
                } finally {
                    client.release()
                }
            })().catch(e => {console.error(e.message)
                res.status(400).send(e.message)})
            break;
        case "removeService":
            (async () => {
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    //for loop to insert all new services
                    for (const service of data.services) {
                        await client.query(queries.query.remove_service, [data.email, service])
                    }
                    await client.query('COMMIT')
                    const result = await client.query(queries.query.get_provided_services, [data.email])
                    console.log(result.rows);

                    res.send(result.rows);
                } catch (e) {
                    await client.query('ROLLBACK')
                    throw e
                } finally {
                    client.release()
                }
            })().catch(e => {console.error(e.message)
                res.status(400).send(e.message)})
            break;
        case "getAvgRating":
            pool.query(queries.query.get_avg_rating, [data.email], (err, result) => {
                if (err) {
                    res.status(400).send(err.message);

                } else {
                    console.log(result);
                    res.send(result.rows);
                }
            });
            break;
        case "getBids":
            pool.query(queries.query.get_my_bids, [data.email], (err, result) => {
                if (err) {
                    res.status(400).send(err.message);

                } else {
                    console.log(result);
                    res.send(result.rows);
                }
            });
            break;
        case "acceptBid":
            (async () => {
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    const tempResult = await client.query(queries.query.accept_bid, [data.bid])
                    const dateOfService = tempResult.rows[0].dateOfService
                    const caretakerEmail = tempResults.rows[0].caretakerEmail
                    await client.query(queries.query.delete_availability, [dateOfService])
                    await client.query('COMMIT')
                    const availResult = await client.query(queries.query.get_availability, [caretakerEmail])
                    const workDateResult = await client.query(queries.query.get_work_schedule, [caretakerEmail])
                    console.log("availabilities: \n" + availResult.rows + "\n work dates: \n" + workDateResult.rows);
                    res.send("availabilities: \n" + availResult.rows + "\n work dates: \n" + workDateResult.rows);
                } catch (e) {
                    await client.query('ROLLBACK')
                    throw e
                } finally {
                    client.release()
                }
            })().catch(e => {console.error(e.message)
                res.status(400).send(e.message)})
            break;
    }


});

module.exports = router;