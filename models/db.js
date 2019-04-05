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
    pool.query(dropTables + createTables)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
}

let dropTables = 'drop table if exists Badges, hasBadge;' +
    'drop table if exists Reviews, Transactions;' +
    'drop table if exists Bids, Availabilities;' +
    'drop table if exists Wallets, Services, provideService;' +
    'drop table if exists BreedDietRestrictions, Diet;' +
    'drop table if exists PetBreed;' +
    'drop table if exists Breeds;' +
    'drop table if exists Species, isOfSpecies cascade;' +
    'drop table if exists CatBreeds;' +
    'drop table if exists Cats;' +
    'drop table if exists DogBreeds;' +
    'drop table if exists Dogs;' +
    'drop table if exists Pets cascade;' +
    'drop table if exists Caretakers;' +
    'drop table if exists PetOwners, OwnsPet cascade;' +
    'drop table if exists Users cascade;';

let createTables = 'CREATE table Users (' +
    'email    varchar(320) PRIMARY KEY,' +
    'name     varchar(255) NOT NULL,' +
    'phone    int NOT null,' +
    'age      int,' +
    'password varchar not null' +
    ');' +

    'insert into Users values (\'a@hotmail.com\', \'Jane\', 91234567, 25, \'12345678\');' +

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
    'pid int primary key,' +
    'age int,' +
    'speciesName varchar(255) references Species not null' +
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

    'create table Diet (' +
    'diet varchar(255) primary key' +
    ');' +

    'create table BreedDietRestrictions (' +
    'breedName varchar(255) references Breeds,' +
    'diet varchar(255) references Diet,' +
    'primary key (breedName, diet)' +
    ');' +

    'create table Availabilities (' +
    ' aid int primary key,' +
    ' email varchar(255) references Caretakers not null, ' +
    ' startDate date not null,' +
    '  endDate date not null,' +
    '  daysOfWeek int not null  ' +
    ');' +

    'create table Bids (' +
    'bid int primary key,' +
    'bidderEmail varchar(255) references PetOwners not null,' +
    'caretakerEmail varchar(255) references Caretakers not null,' +
    '  bidTimeStamp timestamp not null,' +
    '  bidAmount int not null' +
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
