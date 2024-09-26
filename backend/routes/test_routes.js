const express = require('express');
const db = require('../db_setup'); 
const router = express.Router();

router.get('/', async function get_test(req, res) {
  try {
    const result = await db.any('SELECT * FROM test');
    res.json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
