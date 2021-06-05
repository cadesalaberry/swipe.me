import * as awsServerlessExpress from 'aws-serverless-express'
// import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'

import type { Handler } from 'aws-lambda'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import userModel from './models/user'
import deckModel from './models/deck'

import { getConfig } from './config'
import * as httpStatus from 'http-status'

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
  try {
    const config = getConfig()

    res.json(config)
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: 'Could not config.json',
      ...error
    })
  }
})

app.post('/users/username', (req, res) => {
  const {
    username,
    newPreferredUsername
  } = req.body

  userModel.changeUsername(username, newPreferredUsername)
    .then(reply => res.json(reply))
    .catch((error) => {
      console.error(error)
      res.status(error.statusCode || 500).json({
        error: 'Could not change username',
        message: error.message,
        ...error
      })
    })
})
app.get('/decks/:userHandle/:deckHandle', (req, res) => {
  const { deckHandle, userHandle } = req.params

  return deckModel
    .getDeckByHandle(userHandle, deckHandle)
    .then((deck) => {
      res.status(httpStatus.OK).json(deck)
    })
    .catch((error) => {
      res.status(error.statusCode || 500).json({
        error: 'Could not get deck',
        ...error
      })
    })
})
app.post('/decks/:ownerHandle/:deckHandle', (req, res) => {
  const { deckHandle, ownerHandle } = req.params
  const {
    title,
    cards
  } = req.body

  return deckModel
    .updateDeck({ title, ownerHandle, deckHandle, cards })
    .then((deck) => {
      res.status(httpStatus.OK).json(deck)
    })
    .catch((error) => {
      res.status(error.statusCode || 500).json({
        error: 'Could not edit deck',
        ...error
      })
    })
})
app.post('/decks', (req, res) => {
  const {
    ownerHandle,
    deckHandle,
    title,
    cards
  } = req.body

  return deckModel
    .createDeck({ title, ownerHandle, deckHandle, cards })
    .then((deck) => {
      res.status(httpStatus.OK).json(deck)
    })
    .catch((error) => {
      res.status(error.statusCode || 500).json({
        error: 'Could not create deck',
        ...error
      })
    })
})
app.get('/decks', (req, res) => {
  const { ownerHandle } = req.query

  if (typeof ownerHandle !== 'string') {
    return res.status(400).json({
      error: 'ownerHandle is a mandatory string'
    })
  }

  return deckModel
    .getDecksByUserHandle(ownerHandle)
    .then((decks) => {
      res.status(httpStatus.OK).json(decks)
    })
    .catch((error) => {
      res.status(error.statusCode || 500).json({
        error: 'Could not get decks',
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
