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
        pid:         req.body.pid,
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
                    data.pid = rows[0].pid;

                    // IsOfSpecies table
                    await client.query(queries.query.add_isofspecies, [data.pid, data.speciesName])

                    // PetBreed table
                    await client.query(queries.query.add_petbreed, [data.pid, data.breedName])

                    // SpecialNotes table
                    await client.query(queries.query.add_specialnote, [data.pid, data.specialNote])

                    // OwnsPet table
                    await client.query(queries.query.add_pets_owner, [data.email, data.pid])

                    // HasDietRestrictions table
                    await client.query(queries.query.add_diet_restriction, [data.pid, data.diet])

                    await client.query('COMMIT')

                    console.log("\nADD PET SUCCESSFUL\n");
                    console.log(data);

                    res.send(data);

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

            (async () => {
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')

                    // Delete pet
                    const {rows} = await client.query(queries.query.delete_pet, [data.pid])
                    data.pid = rows[0].pid;

                    console.log("\nDELETE PET SUCCESSFUL\n");
                    res.send(data);

                } catch (e) {
                    await client.query('ROLLBACK')
                    throw e
                } finally {
                    client.release()
                }
            })().catch(e => {console.error(e.message)
                res.status(400).send(e.message)})
            break;
        
        case "getAllPets":
            (async () => {
                const client = await pool.connect()
                try {
                    await client.query('BEGIN')

                    // Get All Pets
                    const result = await client.query(queries.query.get_all_pets_from_petowner, [data.email])

                    await client.query('COMMIT')

                    console.log("\nGET PET SUCCESSFUL\n");
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
