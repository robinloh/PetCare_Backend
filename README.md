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

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## FAQ
### Set password for psql
1. Run `psql`.
2. Type in the command: `sudo -u user_name psql db_name`.
2. Type in the command: `ALTER USER user_name WITH PASSWORD 'new_password';`
