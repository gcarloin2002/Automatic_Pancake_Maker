const express = require('express');
const db = require('../db_setup'); 
const router = express.Router();


// Retrieves account via username
router.get('/username/:username', async function get_account_by_username(req, res) {
  const username = req.params.username;
  try {
    const result = await db.one('SELECT * FROM account WHERE Account_Username = $1', [username]);
    res.json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});



// Retrieves account via email
router.get('/email/:email', async function get_account_by_email(req, res) {
  const email = req.params.email;
  try {
    const result = await db.one('SELECT * FROM account WHERE Account_Email = $1', [email]);
    res.json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});


// Retrieves account via id
router.get('/:id', async function get_account(req, res) {
  const account_id = req.params.id;
  try {
    const result = await db.one('SELECT * FROM account WHERE Account_ID = $1', [account_id]);
    res.json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});




// Creates a new account 
router.post('/', async function create_account(req, res) {
  const { account_username, account_password, account_first_name, account_last_name, account_email } = req.body;

  try {
    const result = await db.one(
      `INSERT INTO account (Account_Username, Account_Password, Account_First_Name, Account_Last_Name, Account_Email) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`, 
      [account_username, account_password, account_first_name, account_last_name, account_email]
    );
    res.status(201).json(result);  // Respond with the newly created account
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});





module.exports = router;
