# PetCare_Backend
CS2102 - Database Systems

## Installation

1. Git clone/pull the repository to your own local directory
2. Install npm packages using `npm install`
3. Open SQL Shell (psql). Fill in the necessary details, or simply press Enter for all ﬁelds except password if using default setting.
4. Copy and paste the following code into the console. 

```
CREATE TABLE student_info (
	matric  varchar(9) PRIMARY KEY,
	name    varchar(255) NOT NULL,
	faculty varchar(3) NOT NULL
);

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000001A', 'Leslie Cole', 'SOC');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000002B', 'Myra Morgan', 'SOC');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000003C', 'Raymond Benson', 'SOC');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000004D', 'Wendy Kelley', 'SOC');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000005E', 'Patrick Bowers', 'FOE');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000006F', 'Ralph Hogan', 'FOE');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000007G', 'Cecil Rodriquez', 'SCI');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000008H', 'Delia Ferguson', 'SCI');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000009I', 'Frances Wright', 'SCI');

INSERT INTO student_info (matric, name, faculty)
VALUES ('A0000010J', 'Alyssa Sims', 'SCI');
```

5. Make sure you have a `.env` file in the source directory. The .env file contains a single line `DATABASE_URL=postgres://username:password@host_address:port/database_name`. See Step 8 in the start guide for details.

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
