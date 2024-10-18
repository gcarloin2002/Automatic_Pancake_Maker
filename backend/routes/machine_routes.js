const express = require('express');
const db = require('../db_setup');  // Assuming you have a db setup file for your database connection
const router = express.Router();

// GET request to retrieve all rows from the 'machine' table
router.get('/', async (req, res) => {
  try {
    const machines = await db.any('SELECT * FROM machine');  // Query to get all rows from the 'machine' table
    res.status(200).json(machines);  // Send the result as a JSON response
  } catch (err) {
    console.error('Error fetching machines:', err);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/:machine_id', async (req, res) => {
  const { machine_id } = req.params;  // Extract machine_id from URL params

  try {
    // Query to retrieve machine data by 'machine_id'
    const machine = await db.oneOrNone('SELECT * FROM machine WHERE machine_id = $1', [machine_id]);

    if (machine) {
      res.status(200).json(machine);  // Send machine data as JSON response
    } else {
      res.status(404).send('Machine not found');  // Handle case when no machine is found
    }
  } catch (err) {
    console.error('Error fetching machine:', err);
    res.status(500).send('Internal Server Error');
  }
});



// PUT request to update existing data in the 'machine' table by 'machine_id'
router.put('/:machine_id', async (req, res) => {
  const {
    machine_network,
    machine_name,
    machine_street,
    machine_city,
    machine_state,
    machine_zip_code,
    machine_temperature,
    machine_batter
  } = req.body;
  
  const { machine_id } = req.params;

  try {
    // Update statement with 'machine_id' and NOW() for the timestamp
    const result = await db.none(
      `UPDATE machine 
      SET 
        machine_network = $1,
        machine_name = $2,
        machine_street = $3,
        machine_city = $4,
        machine_state = $5,
        machine_zip_code = $6,
        machine_temperature = $7,
        machine_batter = $8,
        machine_timestamp = NOW()
      WHERE machine_id = $9`,
      [
        machine_network,
        machine_name,
        machine_street,
        machine_city,
        machine_state,
        machine_zip_code,
        machine_temperature,
        machine_batter,
        machine_id  // 'machine_id' from the route params
      ]
    );
    res.status(200).send('Machine data updated successfully');
  } catch (err) {
    console.error('Error updating machine data:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
