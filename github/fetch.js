const request = require('request-promise-native')

const getAvatar = (req, res) => {
  if (req.query && req.query.username.length > 0) {
    const username = req.query.username
    const URI = `https://api.github.com/users/${username}`
    request({
      uri: URI,
      headers: {
        'User-Agent': 'Github Stalker'
      },
      json: true
    })
      .then((data) => {
        res.status(200).send({
          name: data.name,
          avatarUrl: data.avatar_url
        })
      })
      .catch((error) => {
        console.log(error)
        res.status(500).send({error: 'Something went wrong'})
      })
  } else {
    res.status(400).send({error: 'No username querystring'})
  }
}

module.exports.getAvatar = getAvatar
