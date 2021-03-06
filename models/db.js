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
    pool.query(dropTriggers + dropTables + createTables + insertSpecies + insertBreeds + insertDiets + insertBadgesTypes + insertTestUsers + insertStatusTypes + insertServicesTypes + bidsStub + createTriggers)
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
    'insert into availabilities values(\'ct@hotmail.com\', \'2019-05-01\', \'2019-05-01\', 100.2) returning startdate, enddate;' +
    'insert into availabilities values(\'ct@hotmail.com\', \'2019-01-23\', \'2019-01-23\', 543.2) returning startdate, enddate;' +
    'insert into bids values(default, \'po@hotmail.com\', \'ct@hotmail.com\', now(), 900, \'2019-01-23\', \'Won\');' +
    'insert into bids values(default, \'po@hotmail.com\', \'ct@hotmail.com\', now(), 130, \'2019-02-05\', \'Won\');' +
    'insert into bids values(default, \'admin@gmail.com\', \'ct@hotmail.com\', now(), 90, \'2019-05-01\', \'current highest\');' +
    'insert into bids values(default, \'po@hotmail.com\', \'ct@hotmail.com\', now(), 70, \'2019-05-01\', \'outbidded\');' +
    'insert into bids values(default, \'po@hotmail.com\', \'ct@hotmail.com\', now(), 70, \'2019-10-10\', \'Won\');';

let insertTestUsers =
    'insert into users values(\'po@hotmail.com\', \'PetOwner1\', 99999999, \'12345678\', \'false\');' +
    'insert into users values(\'ct@hotmail.com\', \'CareTaker1\', 88888888, \'87654321\', \'false\');' +
    'insert into users values(\'admin@gmail.com\', \'Admin\', 91234567, \'cs2102\', \'false\');' +
    'insert into petowners values(\'po@hotmail.com\');' +
    'insert into petowners values(\'admin@gmail.com\');' +
    'insert into caretakers values(\'ct@hotmail.com\');' +
    'insert into caretakers values(\'admin@gmail.com\');' +
    'insert into admins values(\'admin@gmail.com\');' +
    'insert into wallets values(\'po@hotmail.com\', 0);' +
    'insert into wallets values(\'ct@hotmail.com\', 0);' +
    'insert into wallets values(\'admin@gmail.com\', 99);' +
    'insert into hasBadge values(\'Gold\', \'po@hotmail.com\');' +
    'insert into hasBadge values(\'Silver\', \'ct@hotmail.com\');' +
    'insert into hasBadge values(\'Bronze\', \'admin@gmail.com\');' +
    'insert into reviews values(1, \'very good\', \'ct@hotmail.com\', 5, \'po@hotmail.com\');';

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
    'insert into StatusTypes values (\'Won\');' +
    'insert into StatusTypes values (\'bidding cancelled\');';

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
    'drop view if exists getPastWork;' +
    'drop table if exists Admins;' +
    'drop table if exists hasBadge, Badges;' +
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
    'isdeleted boolean not null,' +
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

    'create table Reviews (' +
    'rid serial primary key,' +
    'review varchar(1024) not null,' +
    'email varchar(255) references Caretakers not null,' +
    'rating int not null,' +
    'byUser varchar(255) references PetOwners not null' +
    ');' +

    'create table Badges (' +
    'badge varchar(255) primary key,' +
    'descript varchar(255)' +
    ');' +

    'create table hasBadge (' +
    'badge varchar(255) references Badges,' +
    'email varchar(255) references Users,' +
    'primary key (badge, email)' +
    ');' +

    'create table SpecialNotes (' +
    'pid int primary key references Pets on delete cascade,' +
    'specialNote varchar(255)' +
    ');' +

    'CREATE VIEW getUsersInfo as SELECT u.email AS email, CASE WHEN po.email IS NULL THEN false ELSE true END AS PetOwner, CASE WHEN ct.email IS NULL THEN false ELSE true END AS CareTaker FROM (Users u LEFT JOIN PetOwners AS po ON (u.email = po.email)) LEFT JOIN CareTakers AS ct ON (u.email = ct.email);' +

    'create view getPetsInfo as SELECT ownspet.email, ownspet.pid, pets.name, petBreed.breedName, isofspecies.speciesname, hasdietrestrictions.diet, specialnotes.specialnote FROM ownspet LEFT JOIN pets on ownspet.pid = pets.pid LEFT JOIN petBreed ON ownspet.pid = petBreed.pid LEFT JOIN isofspecies on ownspet.pid = isofspecies.pid LEFT join hasdietrestrictions on ownspet.PID = hasdietrestrictions.pid left join specialnotes on ownspet.pid = specialnotes.pid;' +

    'create view getPastWork as select users.name, reviews.byuser as email, bids.bidamount, bids.dateofservice, bids.bid, reviews.rating, reviews.review, bids.bidtimestamp from users left join bids on bids.caretakeremail = users.email left join reviews on bids.bid = reviews.rid where status = \'won\';' +

    'create or replace procedure removeAvailability(ctEmail varchar(255), dateToRemove DATE, isAccepted BOOLEAN) language plpgsql as $$ declare procStartDate DATE; procEndDate DATE; price numeric(12,2); begin select startdate, enddate, autoAcceptedPrice into procStartDate, procEndDate, price from availabilities where ctEmail = email and dateToRemove between startdate and ENDDATE; if procStartDate = procEndDate then delete from availabilities where ctEmail = email and startdate = dateToRemove; elseif procStartDate = dateToRemove then update availabilities set startdate = dateToRemove + 1 where ctEmail = email and startdate = dateToRemove; elseif procEndDate = dateToRemove then update availabilities set enddate = dateToRemove - 1 where ctEmail = email and enddate = dateToRemove; elseif procStartDate <> procEndDate then delete from availabilities where ctEmail = email and startdate = procStartDate; insert into availabilities values (ctEmail, procStartDate, dateToRemove - 1, price); insert into availabilities values (ctEmail, dateToRemove + 1, procEndDate, price); end if; if isAccepted = false then update bids set status = \'bidding cancelled\' where caretakeremail = ctEmail and dateofservice = dateToRemove and status = \'current highest\';end if; end $$;' +

    'create or replace function updateWinningBid() returns trigger as $$ declare previousHighestBidder varchar(255); previousHighestAmount numeric(12,2); previousHighestBid numeric(12,2); bidderBalance numeric(12,2); autoWin numeric(12,2); begin select autoacceptedprice into autowin from availabilities where email = new.caretakeremail and new.dateofservice between startdate and enddate; select walletamt into bidderBalance from wallets where email = new.bidderEmail; select bid, bidamount, bidderEmail into previousHighestBid, previousHighestAmount, previousHighestBidder from bids where caretakeremail = new.caretakeremail and dateofservice = new.dateofservice and status = \'current highest\';	if new.bidamount < previousHighestAmount then raise exception \'bidded amount lower than current highest bid\';	return null; elseif ((new.bidamount > previousHighestAmount or previousHighestAmount is null) and new.bidamount <= bidderBalance) then update bids set status = \'outbidded\' where bid = previousHighestBid; update wallets set walletamt = bidderBalance - new.bidamount where email = new.bidderEmail; update wallets set walletamt = oldBidder.walletamt + previousHighestAmount from(select walletamt from wallets where email = previousHighestBidder) as oldBidder where email = previousHighestBidder; if(new.bidamount < autowin) then new.status:= \'current highest\'; else new.status:= \'Won\'; end if; return new; else raise exception \'insufficient balance to bid\'; return null; end if; end; $$ language plpgsql;' +

    'create or replace function addDefaultBids() returns trigger as $$ declare currDate date; begin currDate:= new.startDate; WHILE currDate <= new.endDate loop if not exists (select 1 from bids where caretakeremail = new.email and dateofservice = currDate and status = \'current highest\') then insert into bids values(default, \'admin@gmail.com\', new.email, now(), 0.00, currDate, \'current highest\'); end if; currDate:= currDate + 1; end loop; return new; end; $$ language plpgsql;' +

    'create or replace function cancelBids() returns trigger as $$ begin update wallets set walletamt = walletamt + new.bidamount where email = new.bidderemail; update bids set status = \'bidding cancelled\' where caretakeremail = new.caretakeremail and dateofservice = new.dateofservice and status <> \'current highest\'; return new; end; $$ language plpgsql;' +
    
    'create or replace function creditCaretaker() returns trigger as $$ begin update wallets set walletamt = walletamt + new.bidamount where email = new.caretakeremail; call removeavailability(new.caretakeremail, new.dateofservice, true); return new; end; $$ language plpgsql;';

let createTriggers =
    'create trigger checkValidBid before insert on bids for each row execute procedure updateWinningBid();' +
    'create trigger addDefaultBids after insert on availabilities for each row execute procedure addDefaultBids();' +
    'create trigger cancelBids before update on bids for each row when (old.status = \'current highest\' and new.status = \'bidding cancelled\') execute procedure cancelBids();' +
    'create trigger creditCaretaker before insert or update on bids for each row when (new.status = \'Won\') execute procedure creditCaretaker();';

pool.on('remove', () => {
    console.log('CLIENT REMOVED');
    process.exit(0);
});

module.exports = {
    createDb,
    pool
};

require('make-runnable');
