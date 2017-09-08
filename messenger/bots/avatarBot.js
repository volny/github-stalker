const request = require('request-promise-native')

const getGithubData = (username) => {
  const URI = `https://us-central1-gh-trending-chatbot.cloudfunctions.net/getAvatar?username=${username}`
  return request({
    uri: URI,
    json: true
  })
    .then(data => data)
    .catch((error) => { console.log(error) })
}

const avatarMessage = (username, { name, avatarUrl }) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: name || username,
          item_url: `https://github.com/${username}`,
          image_url: avatarUrl,
          buttons: [{
            type: 'web_url',
            url: `https://github.com/${username}`,
            title: 'Visit Github profile'
          }]
        }]
      }
    }
  }
}

const couldBeUsername = (text) => {
  const trimmed = text.trim()
  const re = /^\b[a-zA-Z0-9_]+\b$/
  return trimmed.search((re)) === 0
}

const avatar = ({ message }) => {
  if (message.text) {
    if (couldBeUsername(message.text)) {
      const username = message.text
      console.log('getting github data for', username)
      return getGithubData(username)
        .then((data) => {
          console.log('got github data')
          if (Object.keys(data).length > 0) {
            console.log('data not empty, sending response')
            return avatarMessage(username, data)
          } else {
            return { text: 'Sorry, seems like that user doesn\'t exist' }
          }
        })
        .catch((error) => {
          console.error(error)
          return { text: 'Sorry, something went wrong contacting Github' }
        })
    } else {
      return { text: 'Sorry, that doesn\'t look like a valid Github username. Please try again' }
    }
  } else if (message.attachments) {
    return { text: 'I\'m scared of attachment 😱' }
  }
}

module.exports.avatar = avatar
