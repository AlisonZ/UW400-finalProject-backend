
const { MONGO_DB_CONNECTION, NODE_ENV, PORT } = process.env
const express = require('express')
const mongoose = require('mongoose')
const app = express()


// Database Connection
// in the w6 project this is pulled out into a connection file under /db
require('./db/connection')()
//if (MONGO_DB_CONNECTION) {
//  mongoose.connect(MONGO_DB_CONNECTION, { useNewUrlParser: true, useFindAndModify: false })
//  console.log('Connected to database...')
//} else {
//  console.log('Could not connect to database!')
//}

//Middleware
if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())


// Routes
app.get('/', (req, res, next) => {
  res.json({
    message: `Hello, Express!`
  })
})


//ADD ERROR HANDLERS FOR ROUTES NOT FOUND


//OPEN CONNECTION
const listener = () => console.log(`Listening on Port ${PORT}`)
app.listen(PORT, listener)