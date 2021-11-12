# swipe.me

why change?
why now?
why my industry?
why my company/product?
why spend the money?

### Run server and client in development
```bash
docker compose start # to start the dynamodb instance
yarn api
yarn client
```

### Deploy in production

```bash
yarn api:deploy
> https://api.swipeme.io/master/config.json

yarn client:build
yarn client:deploy
> https://master.swipeme.io/

# seed the db with some data
yarn api:seed:online

# Use the files built for the frontend in packages/client/dist
yarn serve
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
