const pgp = require('pg-promise')();
require('dotenv').config(); // Load environment variables from .env file

const { DB_CONNECTION_STRING } = process.env; 

const db = pgp({
  connectionString: DB_CONNECTION_STRING, 
});

module.exports = db;
