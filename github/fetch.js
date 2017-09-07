const request = require('request-promise-native')

const getAvatar = (req, res) => {
  const username = req.query.username
  // res.status(200).send({username: username})
  const URI = `https://api.github.com/users/${username}`
  request({
    uri: URI,
    headers: {
      'User-Agent': 'Github Stalker'
    }
  })
    // .then(data => res.status(200).send({url: data.avatar_url}))
    .then(data => res.status(200).send({url: JSON.parse(data).avatar_url}))
    .catch((error) => {
      console.log(error)
      res.status(500).send({error: 'Something went wrong'})
    })
}

module.exports.getAvatar = getAvatar
