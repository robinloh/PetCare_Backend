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
    pool.query(dropTables + createTables + insertSpecies + insertBreeds + insertDiets + insertTestUsers)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
}

let insertTestUsers =
    'insert into users values(\'po@hotmail.com\', \'PetOwnerAdmin\', 99999999, \'12345678\');' +
    'insert into users values(\'ct@hotmail.com\', \'CareTakerAdmin\', 88888888, \'87654321\');' +
    'insert into petowners values(\'po@hotmail.com\');' +
    'insert into caretakers values(\'ct@hotmail.com\');';

let insertSpecies = 'insert into species values (\'Dog\');' +
    'insert into species values (\'Cat\');';

let insertBreeds = 'insert into breeds values (\'Golden Retriever\', \'Dog\');' +
    'insert into breeds values (\'Corgi\', \'Dog\');' +
    'insert into breeds values (\'Husky\', \'Dog\');' +
    'insert into breeds values (\'Persian\', \'Cat\');' +
    'insert into breeds values (\'Russian Blue\', \'Cat\');';

let insertDiets = 'insert into diets values (\'Vegetarian\');' +
    'insert into diets values (\'Carnivore\');' +
    'insert into diets values (\'Gluten-Free\');' +
    'insert into diets values (\'None\');';

let dropTables = 'drop table if exists Badges, hasBadge;' +
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

let createTables = 'CREATE table Users (' +
    'email    varchar(320) primary key,' +
    'name     varchar(255) not null,' +
    'phone    numeric(8) not null,' +
    'password varchar not null' +
    ');' +

    'create table PetOwners (' +
    'email varchar(320) primary key references Users on delete cascade' +
    ');' +

    'create table Caretakers (' +
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
    'pid int references Pets,' +
    'speciesName varchar(255) references Species,' +
    'primary key (pid, speciesName)' +
    ');' +

    'create table OwnsPet (' +
    'email varchar(255) references PetOwners,' +
    'pid int references Pets,' +
    'primary key (email, pid)' +
    ');' +

    'create table PetBreed (' +
    'pid int references Pets primary key,' +
    'breedName varchar(255) references Breeds not null' +
    ');' +

    'create table Diets (' +
    'diet varchar(255) primary key' +
    ');' +

    'create table HasDietRestrictions (' +
    'pid int references Pets,' +
    'diet varchar(255) references Diets,' +
    'primary key (pid, diet)' +
    ');' +

    'create table Availabilities (' +
    ' email varchar(255) references Caretakers not null, ' +
    ' startDate date not null,' +
    '  endDate date not null' +
    ');' +

    'create table StatusTypes (' +
    'status varchar(255) primary key' +
    ');' +
    
    'create table Bids (' +
    'bid int primary key,' +
    'bidderEmail varchar(255) references PetOwners not null,' +
    'caretakerEmail varchar(255) references Caretakers not null,' +
    '  bidTimeStamp timestamp not null,' +
    '  bidAmount int not null,' +
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
    'walletAmt float8 not null ' +
    ');' +

    'create table Transactions (' +
    'tid int primary key,' +
    'transactFrom varchar(255) references Users not null,' +
    'transactTo varchar(255) references Users not null,' +
    'transTimeStamp timestamp not null,' +
    'transAmt float8 not null' +
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
    'pid int primary key references Pets,' +
    'specialNote varchar(255)' +
    ');';

pool.on('remove', () => {
    console.log('CLIENT REMOVED');
    process.exit(0);
});

module.exports = {
    createDb,
    pool
};

require('make-runnable');
