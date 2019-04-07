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
        email:       req.body.email,
        name:        req.body.name,
        speciesName: req.body.speciesName,
        breedName:   req.body.breedName,
        diet:        req.body.diet,
        specialNote: req.body.specialNote
    };

    console.log(data);

    (async () => {

        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            // Pets table
            const {rows} = await client.query(queries.query.add_pet, [data.name])

            // IsOfSpecies table
            await client.query(queries.query.add_isofspecies, [rows[0].pid, data.speciesName])

            // PetBreed table
            await client.query(queries.query.add_petbreed, [rows[0].pid, data.breedName])

            // Diets table
            await client.query(queries.query.add_diet, [data.diet])

            // SpecialNotes table
            await client.query(queries.query.add_specialnote, [rows[0].pid, data.specialNote])

            // OwnsPet table
            await client.query(queries.query.add_pets_owner, [data.email, rows[0].pid])

            await client.query('COMMIT')

            console.log("Add Pet " + data.name + " " + data.speciesName + " " + data.breedName + " " + data.diet + data.specialNote + " successful");

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
