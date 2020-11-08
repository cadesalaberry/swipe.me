# swipe.me

why change?
why now?
why my industry?
why my company/product?
why spend the money?

### Run server and client in development
```
yarn api
yarn client
```

### Deploy in production
```

yarn api:deploy
> https://api.swipeme.io/master

yarn client:build
yarn client:deploy
> https://master.swipeme.io/

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
