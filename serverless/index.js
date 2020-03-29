const awsServerlessExpress = require('aws-serverless-express')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const userModel = require('./models/user')
const deckModel = require('./models/deck')

app.use(bodyParser.json({
  strict: false
}))
app.use(cors({
  origin: '*' // TODO: Handle CORS properly once deployed on the server
}))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/users/:userId', userModel.getUserById)
app.post('/users', userModel.createUser)
app.get('/decks/:deckId', deckModel.getDeckById)
app.post('/decks', deckModel.createDeck)

const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}
