# Github Stalker
## Facebook Messenger Bot to stalk your favorite Github users

Pulls in user actions through [Github's webhook API](https://developer.github.com/webhooks), or maybe through their GraphQL API.

Follow ("stalk") a user by messaging `stalk <username>`. You can also `unstalk`.

### Todo

- change verify token before production

### Next

- check if message is a single word - strip whitespace then look for spaces. If it is assume it's a username and fetch
- post Avatar for requested user

### Someday

- Use Messenger's NLP lib

### Why

- streaming realtime data (Github webhook -> Messenger webhook) seems interesting
