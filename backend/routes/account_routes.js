const express = require('express');
const db = require('../db_setup'); 
const router = express.Router();
const crypto = require('crypto');

// Function to check if input is an email
function isEmail(input) {
  return /\S+@\S+\.\S+/.test(input);
}

// Creates a new account
router.post('/', async function create_account(req, res) {
  const { account_username, account_password, account_first_name, account_last_name, account_email, role = 'user' } = req.body;

  // Check if any required fields are missing
  if (!account_username || !account_password || !account_first_name || !account_last_name || !account_email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Step 1: Check if username or email already exists
    const existingAccount = await db.oneOrNone(
      'SELECT * FROM account WHERE Account_Username = $1 OR Account_Email = $2',
      [account_username, account_email]
    );

    if (existingAccount) {
      return res.status(400).json({ message: 'Username or email already taken' });
    }

    // Step 2: Get the maximum Account_ID and increment it by 1
    const maxIdResult = await db.oneOrNone(
      `SELECT MAX(Account_ID) as max_id FROM account`
    );
    const newAccountId = (maxIdResult && maxIdResult.max_id) ? maxIdResult.max_id + 1 : 1;

    // Step 3: Insert new account with the hashed password from the frontend
    const result = await db.one(
      `INSERT INTO account (Account_ID, Account_Username, Account_Password, Account_First_Name, Account_Last_Name, Account_Email, Role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`, 
      [newAccountId, account_username, account_password, account_first_name, account_last_name, account_email, role]
    );

    res.status(201).json(result);  // Respond with the newly created account
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});


// Login - checks if account exists and verifies hashed password
function hashPassword(password, salt) {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

router.post('/login', async function login(req, res) {
  const { login, account_password } = req.body;  // login can be username or email

  if (!login || !account_password) {
    return res.status(400).json({ message: "Missing login or password" });
  }

  try {
    let account;

    if (isEmail(login)) {
      account = await db.one('SELECT * FROM account WHERE Account_Email = $1', [login]);
    } else {
      account = await db.one('SELECT * FROM account WHERE Account_Username = $1', [login]);
    }

    // Hash the provided password using the same logic as frontend
    const hashedPassword = hashPassword(account_password, account.account_username);

    if (hashedPassword === account.account_password) {
      // Include role in the response
      res.status(200).json({ message: 'Login successful', role: account.role, username: account.account_username });
    } else {
      res.status(401).json({ message: 'Invalid login or password' });
    }
  } catch (err) {
    console.error('Error executing query or user not found', err);
    res.status(500).json({ message: 'Login failed. Please check your credentials and try again.' });
  }
});

// Admin access - Protect this route by checking the user's role
router.get('/admin', async function admin_access(req, res) {
  const { role } = req.body;  // Assuming the user's role is passed in

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  // Admin-only logic here
  res.status(200).json({ message: 'Welcome, admin!' });
});

module.exports = router;
