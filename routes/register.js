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
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };
    console.log(data);

    // TODO: Make SQL query a transaction and insert into caretakers Table
    /*pool.query(queries.query.add_user, [data.email, "John Doe", "0", "0", data.password], (err, result) => {
        if (err) {
            console.log(err.code);
            console.log(err.message);
            console.log(queries.query.add_user);
            res.status(400, "Error");
        } else {
            console.log("user " + data.email + " registered");
            res.send("success");
        }
        // TODO: Make SQL query.
        // Check for duplicate email and return 400 if email already exists.
    });*/

    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect()

        try {
            await client.query('BEGIN')
            const {
                rows
            } = await client.query(queries.query.add_user, [data.email, "John Doe", "0", data.password])

            if (data.role === 'Pet Owner') {
                await client.query(queries.query.add_petowner, [data.email])
            } else {
                await client.query(queries.query.add_caretaker, [data.email])
            }
            await client.query('COMMIT')
            console.log("user " + data.email + " registered");
            res.send("success");
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    })().catch(e => {console.error(e.message)
              res.status(400).send("e.message")})
});

module.exports = router;
