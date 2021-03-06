const queries = {}

queries.query = {

    //for transactions in node, check this link: https://node-postgres.com/features/transactions

    // Account related
    add_user: 'INSERT INTO Users VALUES($1, $2, $3, $4, \'false\')', //[email, name, phone, password, isDeleted]
    delete_user: 'UPDATE Users SET isDeleted = \'true\' WHERE email = $1', // [email]
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
    delete_pet: 'DELETE FROM Pets WHERE pid = $1 RETURNING pid',
    add_pets_owner: 'INSERT INTO OwnsPet VALUES($1, $2)', //[email, pid]
    get_all_pets_from_petowner: 'SELECT pid, name, breedname, speciesname, diet, specialnote FROM getPetsInfo WHERE email = $1', // [name, breedName, speciesName, diet, specialNote]

    // Availability and bids related
    add_availability: 'INSERT INTO Availabilities VALUES($1, $2, $3, $4) RETURNING startDate, endDate', //[email, startDate, endDate, autoAcceptedPrice]
    delete_availability: 'CALL removeAvailability($1, $2, false)', //[email, dateToRemove]
    get_availability: 'SELECT TO_CHAR(startDate, \'YYYY-MM-DD\') AS startDate, TO_CHAR(endDate, \'YYYY-MM-DD\') As endDate, autoAcceptedPrice FROM Availabilities WHERE email = $1', //[email]

    find_services: 'SELECT DISTINCT A.email, u.name, bidamt.bidamount, avgrating, bidamt.dateofservice AS dateofservice FROM Availabilities A NATURAL JOIN Users u LEFT JOIN provideService S on S.email = A.email LEFT JOIN (SELECT R.email, AVG(rating) AS avgrating from reviews R GROUP BY R.email) as AR on AR.email = A.email left join (select bidamount, caretakeremail, TO_CHAR(dateofservice, \'YYYY-MM-DD\') AS dateofservice from Bids b where dateofservice = $1 and status = \'current highest\') as bidamt on bidamt.caretakeremail = A.email WHERE $1 BETWEEN startDate AND endDate AND case when $2::text = \'Any\' then true else serviceid = $2 end AND avgrating >= $4 AND bidamt.bidamount < $3 AND NOT EXISTS (SELECT 1 FROM Bids B WHERE A.email = B.caretakerEmail AND dateOfService = $1 AND status = \'Won\')', // [dateOfService, typeOfService, bidamt, rating]
    get_completed_work: 'SELECT bid, TO_CHAR(DateOfService, \'YYYY-MM-DD\') as DateOfService, users.name as petownerName, bidderEmail, bidAmount FROM Bids INNER JOIN Users on bids.bidderemail = users.email WHERE caretakerEmail = $1 and status = \'Won\' and dateofservice < now()', //[caretakerEmail]
    get_work_schedule: 'SELECT bid, TO_CHAR(DateOfService, \'YYYY-MM-DD\') as DateOfService, users.name as petownerName, bidderEmail, bidAmount FROM Bids INNER JOIN Users on bids.bidderemail = users.email WHERE caretakerEmail = $1 and status = \'Won\' and dateofservice >= now()', //[caretakerEmail]
    get_current_bids: 'with currentHighestBids as (select * from bids inner join users on bids.bidderemail = users.email where status = \'current highest\' and dateofservice >= now()), currentUserBids as (select caretakeremail, dateofservice, max(bidamount) as bidamount from bids where bidderemail = $1 and status <> \'Won\' and dateofservice >= now() group by caretakeremail, dateofservice) select currentHighestBids.bid, currentHighestBids.caretakeremail, TO_CHAR(currentUserBids.dateofservice, \'YYYY-MM-DD\') as dateofservice, currentUserBids.bidamount as bidamount, currentHighestBids.name, currentHighestBids.bidamount as highestamount from currentHighestBids inner join currentUserBids on  currentHighestBids.caretakeremail = currentUserBids.caretakeremail and currentHighestBids.dateofservice = currentUserBids.dateofservice;', // [bidderemail]
    get_my_bids: 'SELECT bid, TO_CHAR(DateOfService, \'YYYY-MM-DD\') as DateOfService, bidderEmail, bidAmount FROM Bids WHERE caretakerEmail = $1 and status = \'current highest\'', //[caretakerEmail]
    update_bid: 'UPDATE Bids SET bidamount = $2 WHERE bid = $1', //[bid, bidamount]
    accept_bid: 'UPDATE Bids SET status = \'Won\' WHERE bid = $1 returning caretakerEmail, DateOfService', //[bid]
    make_bid: 'INSERT INTO bids values (default, $1, $2, now(), $3, $4, null) returning bidtimestamp', //[bidderEmail, caretakerEmail, bidAmt, dateOfService]
    
    
    // Services related
    get_all_services: 'SELECT * FROM Services',
    get_future_services_dates: 'select bid, TO_CHAR(dateofservice, \'YYYY-MM-DD\') as dateofservice, bidamount, users.name as caretakername, users.email as caretakeremail from bids inner join users on bids.caretakeremail = users.email where status = \'Won\' and bids.bidderemail = $1 and dateofservice >= now();', //[bidderEmail]
    get_all_completed_services: 'select bid, TO_CHAR(dateofservice, \'YYYY-MM-DD\') as dateofservice, bidamount, users.name as caretakername, users.email as caretakeremail from bids inner join users on bids.caretakeremail = users.email where status = \'Won\' and bids.bidderemail = $1 and dateofservice < now() ORDER BY dateofservice DESC;', // [bidderemail]
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
    update_wallet_amt: 'UPDATE wallets SET walletamt = $1 WHERE email = $2', // [walletamt, userEmail]
    get_wallet_amt: 'SELECT walletamt FROM wallets where email = $1', //[petownerEmail]

    // Reviews
    // Reviews table: (rid, review, email, rating, byuser)
    create_review: 'INSERT INTO reviews(rid, review, email, rating, byuser) VALUES($1, $2, $3, $4, $5)', // [bid, review, caretakerEmail, rating, petownerEmail]
    update_review: 'UPDATE reviews SET review = $2, rating = $3 WHERE rid = $1;', // [bid, review, rating]
    get_review: 'SELECT R.review, R.email as caretakeremail, R.rating , R.byuser as bidderemail, R.rid, B.bidamount, TO_CHAR(B.dateofservice, \'YYYY-MM-DD\') as dateofservice, U.name as biddername FROM reviews R inner join bids B on B.bid = R.rid inner join users U on R.byuser = U.email where B.status = \'Won\' and R.email = $1;', // [caretakerEmail]
}

module.exports = queries