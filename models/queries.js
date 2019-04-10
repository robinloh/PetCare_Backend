const queries = {}

queries.query = {

    //for transactions in node, check this link: https://node-postgres.com/features/transactions

    // Account related
    add_user: 'INSERT INTO Users VALUES($1, $2, $3, $4)', //[email, name, phone, password]
    get_user_name: 'SELECT name FROM Users WHERE email = $1',
    add_caretaker: 'INSERT INTO Caretakers VALUES($1)', //[email]
    add_petowner: 'INSERT INTO PetOwners VALUES($1)', //[email]
    update_info: 'UPDATE Users SET name = $2, phone = $3, age = $4 WHERE email = $1', //[email, name, phone, age]
    update_password: 'UPDATE Users SET password = $2 WHERE email = $1', //[email, password]
    login: 'SELECT email FROM users WHERE email = $1 AND password = $2', // [email, password]
    get_roles: 'SELECT * FROM getusersinfo WHERE email = $1',
    is_caretaker: 'SELECT * FROM Caretakers WHERE email = $1', //[email] results will be empty if false
    is_petowner: 'SELECT * FROM PetOwners WHERE email = $1', //[email] results will be empty if false

    // Pet related
    add_pet: 'INSERT INTO Pets VALUES($1) RETURNING pid', //[name] pid to be generated
    delete_pet: 'DELETE FROM Pets WHERE pid = $1',
    add_pets_owner: 'INSERT INTO OwnsPet VALUES($1, $2)', //[email, pid]
    get_all_pets_from_petowner: 'SELECT pid FROM getPetsInfo WHERE email = $1', // [pid]

    // Availability and bids related
    add_availability: 'INSERT INTO Availabilities VALUES($1, $2, $3, $4) RETURNING startDate, endDate', //[startDate, endDate, email, autoAcceptedPrice]
    delete_availability: 'DELETE FROM Availabilities WHERE startDate = $1 && endDate = $2 && email = $3', //[startDate, endDate, email]
    get_availability: 'SELECT TO_CHAR(startDate, \'YYYY-MM-DD\') AS startDate, TO_CHAR(endDate, \'YYYY-MM-DD\') As endDate, autoAcceptedPrice FROM Availabilities WHERE email = $1', //[email]

    find_services: 'SELECT email FROM Availabilities A INNER JOIN provideService S WHERE $1 > startDate AND $1 < endDate AND serviceid = $2 AND NOT EXISTS (SELECT 1 FROM Bids B WHERE A.email = B.caretakerEmail AND dateOfService = $1 AND status = "Won")', // [dateOfService, typeOfService]
    get_work_schedule: 'SELECT DateOfService, bidderEmail, bidAmount FROM Bids WHERE caretakerEmail = $1 and status = "Won"', //[caretakerEmail]

    // Services related
    get_all_services: 'SELECT * FROM Services',
    get_provided_services: 'SELECT serviceid FROM provideService WHERE email = $1', //[caretakerEmail]
    add_service: 'INSERT INTO provideService VALUES ($2, $1)', //[caretakerEmail, serviceid]
    remove_service: 'DELETE FROM provideService WHERE email = $1 and serviceid = $2', //[caretakerEmail, serviceid]

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

    // Rating related
    get_avg_rating: 'SELECT TO_CHAR(AVG(rating), \'FM999999999.00\') AS avgrating FROM reviews WHERE email = $1', //[caretakerEmail]
    
    // Badge related
    add_default_badge_to_user: 'INSERT into hasBadge VALUES(\'None\', $1)', // [email]
    get_badge: 'SELECT badge, descript FROM hasBadge NATURAL JOIN badges WHERE email = $1',
    
    // Wallet
    create_wallet: 'INSERT INTO wallets VALUES($1, $2)', //[userEmail, walletamt]
    get_wallet: 'SELECT * FROM wallets where email = $1', // [userEmail]
    update_wallet_amt: 'UPDATE wallets SET walletamt = $1 WHERE email = $2', // [walletamt, userEmail

    // Reviews
    // Reviews table: (rid, review, email, rating, byuser)
    create_review: 'INSERT INTO reviews VALUES($1, $2, $3, $4, $5)', // [bidId, review, caretakerEmail, rating, petownerEmail]
    get_review: 'SELECT * FROM reviews where email = $1', // [caretakerEmail]
}

module.exports = queries