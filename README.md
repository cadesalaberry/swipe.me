# swipe.me

Trigger the serverless build process

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Create user in Cognito

```
aws cognito-idp sign-up \
  --region eu-west-1 \
  --client-id 4ldbtdjcott19onil1ndjh1ei0 \
  --username i.am.a.banana@yopmail.com \
  --password Passw0rd!


aws cognito-idp admin-confirm-sign-up \
  --region eu-west-1 \
  --user-pool-id eu-west-1_maZXR6XzU \
  --username i.am.a.banana@yopmail.com
```
