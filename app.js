
const { MONGO_DB_CONNECTION, NODE_ENV, PORT } = process.env
const express = require('express')
const mongoose = require('mongoose')
const app = express()


// Database Connection
require('./db/connection')()

//Middleware
if (NODE_ENV === 'development') app.use(require('morgan')('dev'));
app.use(require('body-parser').json());


// Routes
//app.get('/', (req, res, next) => {
//  res.json({
//    message: `Hello, Express!`
//  })
//})

app.use('/api', require('./api/routes/auth'));
//this users path may be unnecessary and maybe should be in another location with a different path?
app.use('/api/users', require('./api/routes/users'))




//ADD ERROR HANDLERS FOR ROUTES NOT FOUND


//OPEN CONNECTION
const listener = () => console.log(`Listening on Port ${PORT}`)
app.listen(PORT, listener)


