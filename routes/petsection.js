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
        diet:        req.body.diet,
        name:        req.body.name,
        speciesName: req.body.speciesName,
        breedName:   req.body.breedName,
        specialNote: req.body.specialNote
    };

    switch (data.reqType) {
        
        case 'addPets':
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

                    // SpecialNotes table
                    await client.query(queries.query.add_specialnote, [rows[0].pid, data.specialNote])

                    // OwnsPet table
                    await client.query(queries.query.add_pets_owner, [data.email, rows[0].pid])

                    // HasDietRestrictions table
                    await client.query(queries.query.add_diet_restriction, [rows[0].pid, data.diet])

                    await client.query('COMMIT')

                    console.log("\nADD PET SUCCESSFUL\n");
                    console.log(data);

                    res.send("success");

                } catch (e) {
                    await client.query('ROLLBACK')
                    throw e
                } finally {
                    client.release()
                }
            })().catch(e => {console.error(e.message)
                res.status(400).send("e.message")})
            break;

        case "deletePets":
            pool.query(queries.query.delete_pet, [data.name], (err, result) => {
                if (err) {
                    res.status(400).send(err.stack);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
            break;

        case "getAllSpecies":
            pool.query(queries.query.get_all_species, (err, result) => {
                if (err) {
                    res.status(400).send(err.stack);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
            break;

        case "getAllBreeds":
            pool.query(queries.query.get_all_breeds, [data.speciesName], (err, result) => {
                if (err) {
                    res.status(400).send(err.stack);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
            break;
        
        case "getAllDiets":
            pool.query(queries.query.get_all_diets, (err, result) => {
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
