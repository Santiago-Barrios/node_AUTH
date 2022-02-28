const express =  require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./db/config');
require('dotenv').config();


// Create Server and express app
const app = express();

// connection DB
dbConnection();

// public directory
app.use( express.static('public') );

// CORS
app.use( cors() );

// Read y parse of body
app.use( express.json() );

// Rutes
app.use( '/api/auth', require('./routes/auth') );

// manage all the rutes
app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});

app.listen(process.env.PORT, () => {
    console.log(`server is runnig in port ${ process.env.PORT }`);
});