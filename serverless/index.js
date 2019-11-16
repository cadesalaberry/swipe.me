const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const userModel = require('./models/user')

app.use(bodyParser.json({
  strict: false
}))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/users/:userId', userModel.getUserById)
app.post('/users', userModel.createUser)

module.exports.handler = serverless(app)
