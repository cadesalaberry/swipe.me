import * as awsServerlessExpress from 'aws-serverless-express'
// eslint-disable-next-line no-unused-vars
import type { Handler } from 'aws-lambda'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import userModel from './models/user'
import deckModel from './models/deck'

const app = express()

app.use(bodyParser.json({
  strict: false
}))
app.use(cors({
  origin: '*' // TODO: Handle CORS properly once deployed on the server
}))

app.get('/', function (_req, res) {
  res.send('Hello World!')
})

app.get('/users/:userId', userModel.getUserById)
app.post('/users', userModel.createUser)
app.get('/decks/:deckId', deckModel.getDeckById)
app.post('/decks', deckModel.createDeck)

const server = awsServerlessExpress.createServer(app)

const handler: Handler = (event, context) => {
  // HACK: Remove the stage
  // https://github.com/awslabs/aws-serverless-express/issues/86
  if (event.requestContext.stage) {
    event.path = event.path.replace('/' + event.requestContext.stage, '')
  }

  awsServerlessExpress.proxy(server, event, context)
}

export {
  handler
}
