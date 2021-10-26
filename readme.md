# Pandaroo

An open-source food ordering app with Express-based server, Passport.js authentication and PostgreSQL database.

## Installation

To start, please clone the application and install the node modules dependencies before use.

Install via [npm](https://www.npmjs.com/)

```
$ npm install
```

Next, set up your own database and knex, please make sure your PostgreSQL is running and create your own `.env` file inside the root directory to store your knex connection details.

.env file example:

```
db_name=<your database name>
username=<your username>
password=<your password>

stripe_secret=<your strip secret>

SESSION_SECRET=<your session secret>

GOOGLE_ID=<your google oauth key>
GOOGLE_SECRET=<your google secret>

FACEBOOK_APP_ID=<your facebook oauth key>
FACEBOOK_APP_SECRET=<your facebook oauth secret>

AWS_BUCKET_NAME=<your s3 bucket name>
AWS_BUCKET_REGION=<your s3 bucket region>
AWS_ACCESS_KEY=<your aws access key>
AWS_SECRET_KEY=<your aws secret key>
```

Afterthat, run below command in terminal to get your database ready.

```
$ knex migrate:latest;
$ knex seed:run;
```

The app is ready! You may run the server through node.

```
$ node app.js
```
