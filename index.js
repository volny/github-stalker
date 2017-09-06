const { echo, verify } = require('./messenger/messenger')
const { getAvatar } = require('./github/fetch')

exports = {
  echo,
  verify,
  getAvatar
}
