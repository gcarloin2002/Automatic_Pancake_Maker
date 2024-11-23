const express = require('express');
const db = require('../db_setup'); 
const router = express.Router();


// Creates a new order 
router.post('/', async function create_order(req, res) {
  const { account_id, machine_id, ao_amount, ao_size } = req.body; // Destructure necessary fields from request body

  try {
    // Step 1: Get the maximum ao_id and increment it by 1
    const maxIdResult = await db.oneOrNone(
      `SELECT MAX(ao_id) as max_id FROM account_order`
    );
    const newAoId = (maxIdResult && maxIdResult.max_id) ? maxIdResult.max_id + 1 : 1; // Start from 1 if no orders exist

    // Step 2: Insert the new order into the account_order table with ao_status defaulting to 'Pending'
    const newOrder = await db.one(
      `INSERT INTO account_order (ao_id, account_id, machine_id, ao_amount, ao_size, ao_timestamp, ao_status) 
       VALUES ($1, $2, $3, $4, $5, NOW(), $6) 
       RETURNING *`, 
      [newAoId, account_id, machine_id, ao_amount, ao_size, 'Pending'] // Correctly including 'Pending'
    );

    // Respond with the newly created order
    res.status(201).json(newOrder); // Respond with the newly created order
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error'); // Respond with internal server error
  }
});








// Fetch the five most recent orders by account_id
router.get('/:account_id', async function get_orders(req, res) {
  const { account_id } = req.params; // Get account_id from URL parameters

  // Validate that account_id is provided
  if (!account_id) {
      return res.status(400).json({ error: "account_id is required" }); // Respond with error if account_id is missing
  }

  try {
      // Step 1: Select the five most recent orders from account_order where account_id matches the input parameter
      const orders = await db.any(
          `SELECT * FROM account_order 
           WHERE account_id = $1 
           ORDER BY ao_timestamp DESC 
           LIMIT 5`, 
          [account_id] // Use account_id in the query
      );

      // Step 2: Respond with the orders found
      res.status(200).json(orders); // Respond with the list of orders
  } catch (err) {
      console.error('Error executing query', err);
      res.status(500).send('Internal Server Error'); // Respond with internal server error
  }
});







// Get orders by machine_id with ao_status "In Progress" or "Pending"
router.get('/machine/:machine_id', async (req, res) => {
  const { machine_id } = req.params;

  try {
    const orders = await db.any(
      `SELECT ao.*, a.account_first_name, a.account_last_name 
       FROM account_order ao
       JOIN account a ON ao.account_id = a.account_id
       WHERE ao.machine_id = $1
       AND (ao.ao_status = 'In Progress' OR ao.ao_status = 'Pending')
       ORDER BY ao.ao_timestamp ASC`, 
      [machine_id]
    );

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Update the status of an order by ao_id
router.put('/order/:ao_id', async (req, res) => {
  const { ao_id } = req.params; // Get ao_id from URL parameters
  const { ao_status } = req.body; // Get the new status from request body

  // Validate that ao_status is provided
  if (!ao_status) {
    return res.status(400).json({ error: "ao_status is required" });
  }

  try {
    // Update the status of the order in the database
    const updatedOrder = await db.oneOrNone(
      `UPDATE account_order 
       SET ao_status = $1 
       WHERE ao_id = $2 
       RETURNING *`,
      [ao_status, ao_id]
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: `Order with ao_id ${ao_id} not found` });
    }

    // Respond with the updated order
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).send('Internal Server Error');
  }
});










  
  
module.exports = router;
