const express = require('express');
const db = require('../db_setup'); 
const router = express.Router();

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

module.exports = router;
