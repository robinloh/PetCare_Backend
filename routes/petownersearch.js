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
        reqType:     req.body.post,
        email:       req.body.email,
        rating:      req.body.rating,
        bidamount:   req.body.bidamount,
        startdate:   req.body.startdate
    };

    switch (data.reqType) {
        
        case 'getAllCareTakers':
            (async () => {
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')

                    // Pets table
                    const {rows} = await client.query(queries.query.add_pet, [data.name])
                    data.pid = rows[0].pid;

                } catch (e) {
                    await client.query('ROLLBACK')
                    throw e
                } finally {
                    client.release()
                }
            })().catch(e => {console.error(e.message)
                res.status(400).send("e.message")})
            break;


    }
});

module.exports = router;
