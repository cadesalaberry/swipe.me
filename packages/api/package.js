return {
  name: '@swipeme.io/api',
  version: '1.0.0',
  main: 'dist/index',
  types: 'dist/index',
  files: [
    'dist'
  ],
  scripts: {
  },
  dependencies: {
    // If we use this file for the server, it cannot find versions of packaged modules
    // Serverless: WARNING: Could not determine version of module http-status
    // Serverless: WARNING: Could not determine version of module aws-serverless-express
    // Serverless: WARNING: Could not determine version of module express
    // Serverless: WARNING: Could not determine version of module body-parser
    // Serverless: WARNING: Could not determine version of module cors
    // Serverless: WARNING: Could not determine version of module aws-sdk
    // Serverless: WARNING: Could not determine version of module uuid
  },
  devDependencies: {
  }
}
