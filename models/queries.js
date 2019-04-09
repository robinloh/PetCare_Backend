const queries = {}

queries.query = {	
    
    //for transactions in node, check this link: https://node-postgres.com/features/transactions
    
    // Account related
    add_user: 'INSERT INTO Users VALUES($1, $2, $3, $4)', //[email, name, phone, password]
    add_caretaker: 'INSERT INTO Caretakers VALUES($1)', //[email]
    add_petowner: 'INSERT INTO PetOwners VALUES($1)', //[email]
    update_info: 'UPDATE Users SET name = $2, phone = $3, age = $4 WHERE email = $1', //[email, name, phone, age]
    update_password: 'UPDATE Users SET password = $2 WHERE email = $1', //[email, password]
    login: 'SELECT u.email, CASE WHEN po.email IS NULL THEN false ELSE true END AS PetOwner, CASE WHEN ct.email IS NULL THEN false ELSE true END AS CareTaker FROM (Users u LEFT JOIN PetOwners AS po ON (u.email = po.email)) LEFT JOIN CareTakers AS ct ON (u.email = ct.email) WHERE u.email = $1 AND u.password = $2', // [email,password]
    
    is_caretaker: 'SELECT * FROM Caretakers WHERE email = $1', //[email] results will be empty if false
    is_petowner: 'SELECT * FROM PetOwners WHERE email = $1', //[email] results will be empty if false
    
    // Pet related
    add_pet: 'INSERT INTO Pets VALUES($1) RETURNING pid', //[name] pid to be generated
    delete_pet: 'DELETE FROM Pets WHERE name = $1',
    add_pets_owner: 'INSERT INTO OwnsPet VALUES($1, $2)', //[email, pid]
    get_pets: 'SELECT pid FROM OwnsPet WHERE email = $1', //[email]
    
    // Availability and bids related
    add_availability: 'INSERT INTO Availabilities VALUES($1, $2, $3, $4)', //[startDate, endDate, email, autoAcceptedPrice]
    delete_availability: 'DELETE FROM Availabilities WHERE startDate = $1 && endDate = $2 && email = $3', //[startDate, endDate, email]
    get_availability: 'SELECT startDate, endDate FROM Availabilities WHERE email = $1', //[email]
    
    find_services: 'SELECT email FROM Availabilities A INNER JOIN provideService S WHERE $1 > startDate AND $1 < endDate AND serviceid = $2 AND NOT EXISTS (SELECT 1 FROM Bids B WHERE A.email = B.caretakerEmail AND dateOfService = $1 AND status = "Won")', // [dateOfService, typeOfService]
    get_work_schedule: 'SELECT DateOfService, bidderEmail, bidAmount FROM Bids WHERE caretakerEmail = $1 and status = "Won"', //[caretakerEmail]
    
    // Services related
    get_all_services: 'SELECT * FROM Services',
    
    // Species related
    get_all_species: 'SELECT * FROM Species',
    add_isofspecies: 'INSERT INTO isofspecies VALUES($1, $2)', // [pid, speciesName]

    // Breed related
    get_all_breeds: 'SELECT breedname FROM Breeds WHERE speciesname = $1', // [breedName]

    // PetBreed related
    add_petbreed: 'INSERT INTO petbreed VALUES($1, $2)', // [pid, breedName]

    // Diet related
    add_diet: 'INSERT INTO diets VALUES($1)', // [diet]
    add_diet_restriction: 'INSERT INTO hasDietRestrictions VALUES($1, $2)', // [pid, diet]
    get_all_diets: 'SELECT * FROM diets',

    // SpecialNote related
    add_specialnote: 'INSERT INTO specialnotes VALUES($1, $2)', // [pid, specialNote]
    
}

module.exports = queries