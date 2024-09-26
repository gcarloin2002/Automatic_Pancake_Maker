//APP SETUP
const express = require('express');
const cors = require('cors');

const test_routes = require('./routes/test_routes');


const app = express();
app.use(express.json());


app.use(cors());



const PORT = process.env.PORT || 4000;
app.get("/", (req,res)=>res.send("Automatic Pancake Maker Backend"));
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

app.use('/api/test', test_routes);