import * as awsServerlessExpress from 'aws-serverless-express'
// import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
// eslint-disable-next-line no-unused-vars
import type { Handler } from 'aws-lambda'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import userModel from './models/user'
import deckModel from './models/deck'

const DEFAULT_SERVER_CONFIG = {
  s3Region: process.env.AWS_S3_REGION,
  cognitoRegion: process.env.AWS_COGNITO_REGION,
  cognitoUserPoolId: 'eu-west-1_maZXR6XzU',
  cognitoIdentityPoolId: 'eu-west-1:4e22e863-ff0a-436d-8c3c-f9484ce82994',
  cognitoUserPoolClientId: '4ldbtdjcott19onil1ndjh1ei0'
}

const app = express()

app.use(bodyParser.json({
  strict: false
}))
app.use(cors({
  origin: '*' // TODO: Handle CORS properly once deployed on the server
}))
// app.use(awsServerlessExpressMiddleware.eventContext())

app.get('/', function (_req, res) {
  res.send('Hello World!')
})

app.get('/config.json', function (_req, res) {
  const config = process.env.AWS_USER_POOL_ID
    ? {
      region: process.env.AWS_REGION,
      cognitoUserPoolId: process.env.AWS_USER_POOL_ID,
      cognitoIdentityPoolId: process.env.AWS_IDENTITY_POOL_ID,
      cognitoUserPoolClientId: process.env.AWS_USER_POOL_CLIENT_ID
    }
    : DEFAULT_SERVER_CONFIG

  return res.json(config)
})

app.get('/users/:userId', userModel.getUserById)
app.post('/users', userModel.createUser)
app.get('/decks/:deckHandle', (req, res) => {
  const deckHandle = req.params.deckHandle

  return deckModel
    .getDeckByHandle(deckHandle)
    .then((deck) => {
      res.json(deck)
    })
    .catch((error) => {
      res.status(error.statusCode || 500).json({
        error: 'Could not get deck',
        ...error
      })
    })
})
app.post('/decks', (req, res) => {
  const {
    deckHandle,
    cards
  } = req.body

  return deckModel
    .createDeck({ deckHandle, cards })
    .then((deck) => {
      res.json(deck)
    })
    .catch((error) => {
      res.status(error.statusCode || 500).json({
        error: 'Could not create deck',
        ...error
      })
    })
})

const server = awsServerlessExpress.createServer(app)

const handler: Handler = (event, context) => {
  // HACK: Remove the stage
  // https://github.com/awslabs/aws-serverless-express/issues/86
  if (event.requestContext.stage) {
    event.path = event.path.replace('/' + event.requestContext.stage, '')
  }

  // HACK: Headers are too big for express to handle
  // https://github.com/awslabs/aws-serverless-express/issues/248
  delete event.multiValueHeaders

  awsServerlessExpress.proxy(server, event, context)
}

export {
  handler
}
