import * as httpStatus from 'http-status'
import BackError from './libs/back.error'
import { ServerConfig } from '../../src/store/types'

const DEFAULT_SERVER_CONFIG = {
  stage: 'local',
  s3Region: 'eu-west-1',
  s3Bucket: 'api-swipe-me-local-s3bucket-10msbonbjs00j',
  cognitoRegion: 'eu-west-1',
  cognitoUserPoolDomain: 'swipeme-io-local',
  cognitoUserPoolRedirectUrl: 'http://localhost:8080/',
  cognitoUserPoolId: 'eu-west-1_MMGaX0OJg',
  cognitoIdentityPoolId: 'eu-west-1:de5e4dbe-e701-4608-b06e-e2b167c0ef21',
  cognitoUserPoolClientId: '7156p31521qurvrtqfd079ite8'
}

const getConfig = (): ServerConfig => {
  // FIXME: when offline, the needed ids are not interpreted properly
  const isOffline = process.env.AWS_USER_POOL_ID === '[object Object]'

  if (isOffline) return DEFAULT_SERVER_CONFIG

  if (!process.env.AWS_S3_REGION) throw new BackError('Missing env variable: AWS_S3_REGION', httpStatus.PRECONDITION_FAILED)
  if (!process.env.AWS_S3_BUCKET) throw new BackError('Missing env variable: AWS_S3_BUCKET', httpStatus.PRECONDITION_FAILED)
  if (!process.env.AWS_COGNITO_REGION) throw new BackError('Missing env variable: AWS_COGNITO_REGION', httpStatus.PRECONDITION_FAILED)
  if (!process.env.AWS_USER_POOL_ID) throw new BackError('Missing env variable: AWS_USER_POOL_ID', httpStatus.PRECONDITION_FAILED)
  if (!process.env.AWS_IDENTITY_POOL_ID) throw new BackError('Missing env variable: AWS_IDENTITY_POOL_ID', httpStatus.PRECONDITION_FAILED)
  if (!process.env.AWS_IDENTITY_POOL_DOMAIN) throw new BackError('Missing env variable: AWS_IDENTITY_POOL_DOMAIN', httpStatus.PRECONDITION_FAILED)
  if (!process.env.AWS_IDENTITY_POOL_REDIRECT_URL) throw new BackError('Missing env variable: AWS_IDENTITY_POOL_REDIRECT_URL', httpStatus.PRECONDITION_FAILED)
  if (!process.env.AWS_USER_POOL_CLIENT_ID) throw new BackError('Missing env variable: AWS_USER_POOL_CLIENT_ID', httpStatus.PRECONDITION_FAILED)

  return {
    s3Region: process.env.AWS_S3_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET,
    cognitoRegion: process.env.AWS_COGNITO_REGION,
    cognitoUserPoolId: process.env.AWS_USER_POOL_ID,
    cognitoUserPoolDomain: process.env.AWS_IDENTITY_POOL_DOMAIN,
    cognitoUserPoolRedirectUrl: process.env.AWS_IDENTITY_POOL_REDIRECT_URL,
    cognitoIdentityPoolId: process.env.AWS_IDENTITY_POOL_ID,
    cognitoUserPoolClientId: process.env.AWS_USER_POOL_CLIENT_ID
  }
}

// Makes sure tu throw an error if a variable is missing
getConfig()

export {
  getConfig
}
