interface ServerConfig {
  s3Region: string;
  s3Bucket: string;
  cognitoRegion: string;
  cognitoUserPoolId: string;
  cognitoIdentityPoolId: string;
  cognitoUserPoolClientId: string;
}

const DEFAULT_SERVER_CONFIG = {
  stage: 'dev',
  s3Region: 'eu-west-1',
  s3Bucket: 'swipeme.io-dev',
  cognitoRegion: 'eu-west-1',
  cognitoUserPoolId: 'eu-west-1_maZXR6XzU',
  cognitoIdentityPoolId: 'eu-west-1:4e22e863-ff0a-436d-8c3c-f9484ce82994',
  cognitoUserPoolClientId: '4ldbtdjcott19onil1ndjh1ei0'
}

const getConfig = (): ServerConfig => {
  // FIXME: when offline, the needed ids are not interpreted properly
  const isOffline = process.env.AWS_USER_POOL_ID === '[object Object]'

  if (isOffline) return DEFAULT_SERVER_CONFIG

  if (!process.env.AWS_S3_REGION) throw new Error('Missing env variable: AWS_S3_REGION')
  if (!process.env.AWS_S3_BUCKET) throw new Error('Missing env variable: AWS_S3_BUCKET')
  if (!process.env.AWS_COGNITO_REGION) throw new Error('Missing env variable: AWS_COGNITO_REGION')
  if (!process.env.AWS_USER_POOL_ID) throw new Error('Missing env variable: AWS_USER_POOL_ID')
  if (!process.env.AWS_IDENTITY_POOL_ID) throw new Error('Missing env variable: AWS_IDENTITY_POOL_ID')
  if (!process.env.AWS_USER_POOL_CLIENT_ID) throw new Error('Missing env variable: AWS_USER_POOL_CLIENT_ID')

  return {
    s3Region: process.env.AWS_S3_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET,
    cognitoRegion: process.env.AWS_COGNITO_REGION,
    cognitoUserPoolId: process.env.AWS_USER_POOL_ID,
    cognitoIdentityPoolId: process.env.AWS_IDENTITY_POOL_ID,
    cognitoUserPoolClientId: process.env.AWS_USER_POOL_CLIENT_ID
  }
}

export {
  getConfig
}
