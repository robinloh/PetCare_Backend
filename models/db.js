const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
    console.log('SUCCESSFULLY CONNECTED TO THE DATABASE');
});

const createDb = () => {
    pool.query(dropTriggers + dropTables + createTables + insertSpecies + insertBreeds + insertDiets + insertTestUsers + insertStatusTypes + insertServicesTypes + insertBadgesTypes +bidsStub + createTriggers)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
}

let bidsStub = 
    'insert into availabilities values(\'ct@hotmail.com\', \'2019-01-01\', \'2019-01-01\', 100.2) returning startdate, enddate;insert into bids values(default, \'po@hotmail.com\', \'ct@hotmail.com\', now(), 100, \'2019-01-01\', \'current highest\');';

let insertTestUsers =
    'insert into users values(\'po@hotmail.com\', \'PetOwner1\', 99999999, \'12345678\');' +
    'insert into users values(\'ct@hotmail.com\', \'CareTaker1\', 88888888, \'87654321\');' +
    'insert into users values(\'admin@gmail.com\', \'Admin\', 91234567, \'cs2102\');' +
    'insert into petowners values(\'po@hotmail.com\');' +
    'insert into caretakers values(\'ct@hotmail.com\');' +
    'insert into admins values(\'admin@gmail.com\');' +
    'insert into wallets values(\'po@hotmail.com\', 0);' +
    'insert into wallets values(\'ct@hotmail.com\', 0);' +
    'insert into hasBadge values(\'Gold\', \'po@hotmail.com\');' +
    'insert into hasBadge values(\'Silver\', \'ct@hotmail.com\');';

let insertSpecies = 
    'insert into species values (\'Dog\');' +
    'insert into species values (\'Cat\');';

let insertBreeds = 
    'insert into breeds values (\'Golden Retriever\', \'Dog\');' +
    'insert into breeds values (\'Corgi\', \'Dog\');' +
    'insert into breeds values (\'Husky\', \'Dog\');' +
    'insert into breeds values (\'Persian\', \'Cat\');' +
    'insert into breeds values (\'Russian Blue\', \'Cat\');';

let insertDiets = 
    'insert into diets values (\'Vegetarian\');' +
    'insert into diets values (\'Carnivore\');' +
    'insert into diets values (\'Gluten-free\');' +
    'insert into diets values (\'None\');';

let insertStatusTypes = 
    'insert into StatusTypes values (\'outbidded\');' +
    'insert into StatusTypes values (\'current highest\');' +
    'insert into StatusTypes values (\'Won\');';

let insertServicesTypes = 
    'insert into Services values (\'Pet Walking\');' +
    'insert into Services values (\'Pet Grooming\');' +
    'insert into Services values (\'Pet Boarding\');' +
    'insert into services values (\'Nail Care\');' +
    'insert into services values (\'Pet Exercise\');' +
    'insert into services values (\'Pet Training\');' +
    'insert into services values (\'Hair Dressing\');';

let insertBadgesTypes =
    'insert into Badges values (\'Gold\', \'Gold Badge - Congratulations! You have attained the highest badge\');' +
    'insert into Badges values (\'Silver\', \'Silver Badge - Aim for the gold badge!\');' +
    'insert into Badges values (\'Bronze\', \'Bronze Badge - Aim for the silver badge!\');' +
    'insert into Badges values (\'None\', \'None - Earn a badge by helping more pets!\');';

let dropTriggers =
    'drop trigger if exists checkValidBid on bids;';

let dropTables = 
    'drop view if exists getUsersInfo;' +
    'drop view if exists getPetsInfo;' +
    'drop table if exists Admins;' +
    'drop table if exists Badges, hasBadge;' +
    'drop table if exists Reviews, Transactions;' +
    'drop table if exists Bids, Availabilities, StatusTypes;' +
    'drop table if exists Wallets, Services, provideService;' +
    'drop table if exists BreedDietRestrictions cascade;' +
    'drop table if exists HasDietRestrictions cascade;' +
    'drop table if exists Diets cascade;' +
    'drop table if exists PetBreed;' +
    'drop table if exists Diet cascade;' + // TODO: To remove
    'drop table if exists Breeds cascade;' +
    'drop table if exists Species, isOfSpecies cascade;' +
    'drop table if exists CatBreeds;' +
    'drop table if exists Cats;' +
    'drop table if exists DogBreeds;' +
    'drop table if exists Dogs;' +
    'drop table if exists Pets cascade;' +
    'drop table if exists Caretakers;' +
    'drop table if exists PetOwners, OwnsPet cascade;' +
    'drop table if exists Users cascade;' +
    'drop table if exists SpecialNotes;';

let createTables = 
    'CREATE table Users (' +
    'email    varchar(320) primary key,' +
    'name     varchar(255) not null,' +
    'phone    int not null,' +
    'password varchar not null,' +
    'CHECK (phone >= 80000000 AND phone <= 99999999)' +
    ');' +

    'create table PetOwners (' +
    'email varchar(320) primary key references Users on delete cascade' +
    ');' +

    'create table Caretakers (' +
    'email varchar(320) primary key references Users on delete cascade' +
    ');' +

    'create table Admins (' +
    'email varchar(320) primary key references Users on delete cascade' +
    ');' +

    'create table Species (' +
    'speciesName varchar(255) primary key' +
    ');' +

    'create table Breeds (' +
    'breedName varchar(255) primary key,' +
    'speciesName varchar(255) references Species ' +
    '); ' +

    'create table Pets (' +
    'name varchar(255) not null,' +
    'pid serial primary key' +
    ');' +

    'create table isOfSpecies (' +
    'pid int references Pets on delete cascade,' +
    'speciesName varchar(255) references Species,' +
    'primary key (pid, speciesName)' +
    ');' +

    'create table OwnsPet (' +
    'email varchar(255) references PetOwners,' +
    'pid int references Pets on delete cascade,' +
    'primary key (email, pid)' +
    ');' +

    'create table PetBreed (' +
    'pid int primary key references Pets on delete cascade,' +
    'breedName varchar(255) references Breeds not null' +
    ');' +

    'create table Diets (' +
    'diet varchar(255) primary key' +
    ');' +

    'create table HasDietRestrictions (' +
    'pid int references Pets on delete cascade,' +
    'diet varchar(255) references Diets,' +
    'primary key (pid, diet)' +
    ');' +

    'create table Availabilities (' +
    ' email varchar(255) references Caretakers not null, ' +
    ' startDate date not null,' +
    '  endDate date not null,' +
    '  autoAcceptedPrice numeric(12,2) not null,' +
    'primary key (email, startDate, endDate)' +
    ');' +

    'create table StatusTypes (' +
    'status varchar(255) primary key' +
    ');' +
    
    'create table Bids (' +
    'bid serial primary key,' +
    'bidderEmail varchar(255) references PetOwners not null,' +
    'caretakerEmail varchar(255) references Caretakers not null,' +
    '  bidTimeStamp timestamp not null,' +
    '  bidAmount numeric(12,2) not null,' +
    '  dateOfService date not null,' +
    '  status varchar(255) references StatusTypes not null' +
    ');' +

    'create table Services (' +
    'serviceid varchar(255) primary key' +
    ');' +

    'create table provideService (' +
    'serviceid varchar(255) references Services,' +
    'email varchar(255) references Caretakers,' +
    '  primary key (serviceid, email)' +
    ');' +

    'create table Wallets (' +
    'email varchar(255) references Users primary key,' +
    'walletAmt numeric(12,2) not null ' +
    ');' +

    'create table Transactions (' +
    'tid int primary key,' +
    'transactFrom varchar(255) references Users not null,' +
    'transactTo varchar(255) references Users not null,' +
    'transTimeStamp timestamp not null,' +
    'transAmt numeric(12,2) not null' +
    ');' +

    'create table Reviews (' +
    'rid int primary key,' +
    'review varchar(1024) not null,' +
    'email varchar(255) references Caretakers not null,' +
    'rating int,' +
    'byUser varchar(255) references PetOwners not null' +
    ');' +

    'create table Badges (' +
    'badge varchar(255) primary key,' +
    'descript varchar(255)' +
    ');' +

    'create table hasBadge (' +
    'badge varchar(255),' +
    'email varchar(255) references Users,' +
    'primary key (badge, email)' +
    ');' +
    
    'create table SpecialNotes (' +
    'pid int primary key references Pets on delete cascade,' +
    'specialNote varchar(255)' +
    ');' +

    'CREATE VIEW getUsersInfo as SELECT u.email AS email, CASE WHEN po.email IS NULL THEN false ELSE true END AS PetOwner, CASE WHEN ct.email IS NULL THEN false ELSE true END AS CareTaker FROM (Users u LEFT JOIN PetOwners AS po ON (u.email = po.email)) LEFT JOIN CareTakers AS ct ON (u.email = ct.email);' +
    
    'create view getPetsInfo as SELECT ownspet.email, ownspet.pid, pets.name, petBreed.breedName, isofspecies.speciesname, hasdietrestrictions.diet, specialnotes.specialnote FROM ownspet LEFT JOIN pets on ownspet.pid = pets.pid LEFT JOIN petBreed ON ownspet.pid = petBreed.pid LEFT JOIN isofspecies on ownspet.pid = isofspecies.pid LEFT join hasdietrestrictions on ownspet.PID = hasdietrestrictions.pid left join specialnotes on ownspet.pid = specialnotes.pid;' +
    
    'create or replace procedure removeAvailability(ctEmail varchar(255), dateToRemove DATE) language plpgsql as $$ declare procStartDate DATE; procEndDate DATE; price numeric(12,2); begin select startdate, enddate, autoAcceptedPrice into procStartDate, procEndDate, price from availabilities where ctEmail = email and dateToRemove between startdate and ENDDATE; if procStartDate = procEndDate then delete from availabilities where ctEmail = email and startdate = dateToRemove; elseif procStartDate = dateToRemove then update availabilities set startdate = dateToRemove + 1 where ctEmail = email and startdate = dateToRemove; elseif procEndDate = dateToRemove then update availabilities set enddate = dateToRemove - 1 where ctEmail = email and enddate = dateToRemove; elseif procStartDate <> procEndDate then delete from availabilities where ctEmail = email and startdate = procStartDate; insert into availabilities values (ctEmail, procStartDate, dateToRemove - 1, price); insert into availabilities values (ctEmail, dateToRemove + 1, procEndDate, price); end if; commit; end $$;' +
    
    'create or replace function updateWinningBid() returns trigger as $$ declare previousHighestBidder varchar(255); previousHighestAmount numeric(12,2); previousHighestBid numeric(12,2); bidderBalance numeric(12,2); begin select walletamt into bidderBalance from wallets where email = new.bidderEmail; select bid, bidamount, bidderEmail into previousHighestBid, previousHighestAmount, previousHighestBidder from bids where caretakeremail = new.caretakeremail and dateofservice = new.dateofservice and status = \'current highest\';	if new.bidamount < previousHighestAmount then raise exception \'bidded amount lower than current highest bid\';	return null; elseif (new.bidamount > previousHighestAmount and new.bidamount < bidderBalance) then update bids set status = \'outbidded\' where bid = previousHighestBid; update wallets set walletamt = bidderBalance - new.bidamount where email = new.bidderEmail; update wallets set walletamt = oldBidder.walletamt + new.bidamount from(select walletamt from wallets where email = previousHighestBidder) as oldBidder where email = previousHighestBidder; new.status:= \'current highest\'; return new; else raise exception \'insufficient balance to bid\'; return null; end if; end; $$ language plpgsql;';

let createTriggers =
    'create trigger checkValidBid before insert on bids for each row execute procedure updateWinningBid();';

pool.on('remove', () => {
    console.log('CLIENT REMOVED');
    process.exit(0);
});

module.exports = {
    createDb,
    pool
};

require('make-runnable');
