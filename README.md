# PetCare_Backend
CS2102 - Database Systems

## Installation for FIRST TIME

* Git clone/pull the repository to your own local directory
* Open SQL Shell (psql). Fill in the necessary details, or simply press Enter for all ﬁelds except password if using default setting.
* Type `CREATE DATABASE petcare;` to create a new database called "petcare". 
* Create a new `.env` file and add this line in the file, replacing `username` and `password` fields where appropriate. ```DATABASE_URL=postgres://username:password@localhost:5432/petcare```.
* Install npm packages using `npm install`.
* Initialise the database by running `npm run create`.


## Available Scripts

In the project directory, you can run:

### `npm run create`
Initialises the database tables and data.

### `npm start`
Runs the database in normal mode.

### `npm run dev`
Runs the database in development mode.
The database will reload if you make edits.


## FAQ
### Set password for psql
1. Run `psql`.
2. Type in the command: `sudo -u user_name psql db_name`.
2. Type in the command: `ALTER USER user_name WITH PASSWORD 'new_password';`
