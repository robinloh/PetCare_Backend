const queries = {}

queries.query = {	
    
    //for transactions in node, check this link: https://node-postgres.com/features/transactions
    
    // Account related
    add_user: 'INSERT INTO Users VALUES($1, $2)', //[email, name, phone, password]
    add_caretaker: 'INSERT INTO Caretakers VALUES($1)', //[email]
    add_petowner: 'INSERT INTO PetOwners VALUES($1)', //[email]
    update_info: 'UPDATE Users SET name = $2, phone = $3, age = $4 WHERE email = $1', //[email, name, phone, age]
    update_password: 'UPDATE Users SET password = $2 WHERE email = $1', //[email, password]
    login: 'select email from Users WHERE email = $1 and password = $2', // [email,password]
    
    is_caretaker: 'SELECT * FROM Caretakers WHERE email = $1', //[email] results will be empty if false
    is_petowner: 'SELECT * FROM PetOwners WHERE email = $1', //[email] results will be empty if false
    
    // Pet related
    add_pet: 'INSERT INTO Pets VALUES($1) RETURNING pid', //[name, age, speciesName, breedName] pid to be generated; speciesname and breedname selected from list
    add_pets_owner: 'INSERT INTO OwnsPet VALUES($1, $2)', //[email, pid]
    get_pets: 'SELECT pid FROM OwnsPet WHERE email = $1', //[email]
    
    // Availability and bids related
    add_availability: 'INSERT INTO Availabilities VALUES($1, $2, $3)', //[startDate, endDate, email]
    delete_availability: 'DELETE FROM Availabilities WHERE startDate = $1 && endDate = $2 && email = $3', //[startDate, endDate, email]
    get_availability: 'SELECT startDate, endDate FROM Availabilities WHERE email = $1', //[email]
    
    find_services: 'SELECT email FROM Availabilities A INNER JOIN provideService S WHERE $1 > startDate AND $1 < endDate AND serviceid = $2 AND NOT EXISTS (SELECT 1 FROM Bids B WHERE A.email = B.caretakerEmail AND dateOfService = $1 AND status = "Won")', // [dateOfService, typeOfService]
    get_work_schedule: 'SELECT DateOfService FROM Bids WHERE email = $1 and status = "Won"', //[email]
    
    // isOfSpecies related
    add_isofspecies: 'INSERT INTO isofspecies VALUES($1, $2)',

    // PetBreed related
    add_petbreed: 'INSERT INTO petbreed VALUES($1, $2)',

    // Diet related
    add_diet: 'INSERT INTO diets VALUES($1)',

    // SpecialNote related
    add_specialnote: 'INSERT INTO specialnotes VALUES($1, $2)',
    
}

module.exports = queries