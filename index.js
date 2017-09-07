const { echo, verify } = require('./messenger/messenger')
const { getAvatar } = require('./github/fetch')

exports = Object.assign(exports, {
  echo,
  verify,
  getAvatar
})
