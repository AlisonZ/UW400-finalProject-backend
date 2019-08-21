//this code is copied from w2-express lecture and should be adjusted as mongoDB is added and the code gets more complex

const { NODE_ENV='development', PORT=5000 } = process.env
const express = require('express')
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

app.get('/', (req, res, next) => {
  res.json({
    message: 'Hello, Express!'
  })
})

const listener = () => console.log(`Listening on Port ${PORT}`)
app.listen(PORT, listener)