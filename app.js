
const { MONGO_DB_CONNECTION, NODE_ENV, PORT, CLIENT_BASE_URL } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
var cors = require('cors');


// Database Connection
require('./db/connection')()

//Middleware
if (NODE_ENV === 'development') app.use(require('morgan')('dev'));
app.use(require('body-parser').json());

//Attach token to request
app.use(require('./api/middleware/set-token'));

app.use(cors({
    origin: CLIENT_BASE_URL,
    optionsSuccessStatus: 200
}));


// Routes
app.use('/api', require('./api/routes/auth'));
//this users path may be unnecessary and maybe should be in another location with a different path?
//app.use('/api/users', require('./api/routes/users'));
app.use('/api/students', require('./api/routes/students'));
app.use('/api/assignments', require('./api/routes/assignments'));



//ADD ERROR HANDLERS FOR ROUTES NOT FOUND


//OPEN CONNECTION
const listener = () => console.log(`Listening on Port ${PORT}`)
app.listen(PORT, listener)


