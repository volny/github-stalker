const request = require('request-promise-native')

const getAvatar = (username) => {
  const URI = `https://api.github.com/users/${username}`
  const url = request(URI)
    .then((data) => data.avatar_url)
  return url
}

module.exports.getAvatar = getAvatar
