const { verify } = require('./messenger/bots/verify')
const { getAvatar } = require('./github/fetch')
const { echo, avatar, stalker } = require('./messenger/messenger')

// HTTP Function: verify webhook callback URL with Facebook
exports.verify = verify
// HTTP Function: calls Github API and sends user profile information
exports.getAvatar = getAvatar
// Bot: echos messages
exports.echo = echo
// Bot: takes Github username and sends avatar image
exports.avatar = avatar
// Bot: allows users to subscribe ('stalk') to Github users
exports.stalker = stalker
