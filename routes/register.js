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
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };
    console.log(data);

    (async () => {

        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            // Write to User table
            await client.query(queries.query.add_user, [data.email, data.name, data.phone, data.password]);

            // Write to wallets, $0
            await client.query(queries.query.create_wallet, [data.email, 0]);

            // Write to role table
            if (data.role === 'Pet Owner') {
                await client.query(queries.query.add_petowner, [data.email]);
            } else {
                await client.query(queries.query.add_caretaker, [data.email]);
            }

            await client.query('COMMIT');
            console.log("user " + data.email + " registered");
            res.send("success");
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release()
        }
    })().catch(e => {
        console.error(e.message)
        res.status(400).send("e.message")
    })
});

module.exports = router;
