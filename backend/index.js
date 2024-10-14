//APP SETUP
const express = require('express');
const cors = require('cors');

const account_routes = require('./routes/account_routes')
const account_order_routes = require('./routes/account_order_routes')

const app = express();
app.use(express.json());


app.use(cors());



const PORT = 4000;
app.get("/", (req,res)=>res.send("Automatic Pancake Maker Backend"));
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

app.use('/api/account', account_routes);
app.use('/api/account_order', account_order_routes);