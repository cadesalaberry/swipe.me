import * as httpStatus from 'http-status'
import BackError from './libs/back.error'

interface ServerConfig {
  s3Region: string;
  s3Bucket: string;
  cognitoRegion: string;
  cognitoUserPoolId: string;
  cognitoIdentityPoolId: string;
  cognitoUserPoolClientId: string;
}

const DEFAULT_SERVER_CONFIG = {
  stage: 'local',
  s3Region: 'eu-west-1',
  s3Bucket: 'api-swipe-me-local-s3bucket-1kcvqhmf164zs',
  cognitoRegion: 'eu-west-1',
  cognitoUserPoolId: 'eu-west-1_s061rv8nC',
  cognitoIdentityPoolId: 'eu-west-1:5ec84746-5a7e-48a8-be85-1497afe5bdb9',
  cognitoUserPoolClientId: '2da3fqcdiooakvr5j0ut7uuieo'
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
  if (!process.env.AWS_USER_POOL_CLIENT_ID) throw new BackError('Missing env variable: AWS_USER_POOL_CLIENT_ID', httpStatus.PRECONDITION_FAILED)

  return {
    s3Region: process.env.AWS_S3_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET,
    cognitoRegion: process.env.AWS_COGNITO_REGION,
    cognitoUserPoolId: process.env.AWS_USER_POOL_ID,
    cognitoIdentityPoolId: process.env.AWS_IDENTITY_POOL_ID,
    cognitoUserPoolClientId: process.env.AWS_USER_POOL_CLIENT_ID
  }
}

// Makes sure tu throw an error if a variable is missing
getConfig()

export {
  getConfig
}
